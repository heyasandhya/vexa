"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CodePanel } from "./CodePanel";
import { FileData, Message, StatusStep } from "@/types/workspace";
import ChatPanel from "./ChatPanel";
import { MIN_CREDITS_TO_GENERATE } from "@/lib/constants";
import { toast } from "sonner";

interface WorkspaceClientProps {
	initialPrompt: string | null;
	userCredits: number;
	userId: string;
	userPlan: string;
}

const WorkspaceClient = ({
	initialPrompt,
	userCredits,
	userId,
	userPlan,
}: WorkspaceClientProps) => {
	const [workspaceId, setWorkspaceId] = useState<string | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [credits, setCredits] = useState(userCredits);
	const [fileData, setFileData] = useState<FileData | null>(null);

	const [isGenerating, setIsGenerating] = useState(false);

	const [statusLog, setStatusLog] = useState<StatusStep[]>([]);

	const messagesRef = useRef<Message[]>(messages);
	useEffect(() => {
		messagesRef.current = messages;
	}, [messages]);

	const fileDataRef = useRef<FileData | null>(fileData);
	useEffect(() => {
		fileDataRef.current = fileData;
	}, [fileData]);

	const workspaceIdRef = useRef<string | null>(workspaceId);
	useEffect(() => {
		workspaceIdRef.current = workspaceId;
	}, [workspaceId]);

	const handleFilePatch = useCallback((patches: FileData) => {
		setFileData(patches);
	}, []);

	const handleGenerate = useCallback(
		async (prompt: string, imageUrl?: string) => {
			if (isGenerating) return;
			if (credits < MIN_CREDITS_TO_GENERATE) return;

			const userMessage: Message = {
				role: "user",
				content: prompt,
				...(imageUrl ? { imageUrl } : {}),
			};

			const currentMessages = messagesRef.current;
			const currentWorkspaceId = workspaceIdRef.current;

			setMessages((prev) => [...prev, userMessage]);
			setIsGenerating(true);
			setStatusLog([{ label: "thinking...", status: "running" }]);


			try {
				const res = await fetch("/api/gen-ai-code", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						workspaceId: currentWorkspaceId,
						userId,
						messages: [...currentMessages, userMessage],
						fileData: fileDataRef.current,
					}),
				});

				if (res.status === 402) {
					toast.error("Not enough credits.");
					setMessages((prev) => prev.slice(0, -1));
					return;
				}

				if (res.status === 429) {
					toast.error("Too many requests. Please slow down.");
					setMessages((prev) => prev.slice(0, -1));
					return;
				}

				if (!res.ok || !res.body) throw new Error("Generation failed");

				const reader = res.body.getReader();
				const decoder = new TextDecoder();
				let buffer = "";
			} catch (error) { }

		},
		[credits, isGenerating, userId],
	);


	return (
		<div className='mt-16 flex h-[calc(100vh-4rem)] overflow-hidden bg-[#0a0a0a]'>
			{/*chat panel-left */}
			<ChatPanel
				messages={messages}
				isGenerating={isGenerating}
				isImproving={false}
				statusLog={statusLog}
				credits={credits}
				initialPrompt={initialPrompt}
				onGenerate={handleGenerate}
				userId={userId}
				workspaceId={workspaceId}
				appTitle={'Test Title'}
			/>

			{/*code panel-right */}
			<CodePanel
				fileData={fileData}
				isGenerating={isGenerating}
				statusLog={statusLog}
				onFilePatch={handleFilePatch} />
		</div>
	)
}

export default WorkspaceClient
