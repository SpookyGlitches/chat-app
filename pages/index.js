import Head from "next/head";
import Auth from "../components/Auth";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Layout } from "antd";
import Header from "../components/Header";
const { Sider, Content, Footer } = Layout;
import Rooms from "../components/Rooms";

export default function Home() {
	const [session, setSession] = useState(null);

	useEffect(() => {
		setSession(supabase.auth.session());

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);
	return (
		<div className="container ">
			{!session ? (
				<Auth />
			) : (
				<Layout style={{ height: "100vh" }}>
					<Sider
						style={{
							overflow: "auto",
							height: "100%",
						}}
					>
						<Rooms />
					</Sider>
					<Layout>
						<Header />
						<Content>Content</Content>
						<Footer>Footer</Footer>
					</Layout>
				</Layout>
			)}
		</div>
	);
}
