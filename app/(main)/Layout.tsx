import React from "react";

const Layout = ({
	children,
}: Readonly<{children: React.ReactNode;

}>) => {
	return <div className="mt-16">{children}</div>
};

export default Layout