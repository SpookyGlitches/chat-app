import Head from "next/head";
import Auth from "../components/Auth";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Layout, Space, Typography, Row } from "antd";
import Header from "../components/Header";
const { Sider, Content, Footer } = Layout;
import Rooms from "../components/Rooms";
import Room from "../components/Room";

export default function Home() {
	const [session, setSession] = useState(null);

	useEffect(() => {
		setSession(supabase.auth.session());

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	const [pickedRoom, setPickedRoom] = useState(null);

	useEffect(() => {
		console.log(pickedRoom);
	}, [pickedRoom]);
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
						<Typography.Title
							level={2}
							style={{
								color: "white",
								padding: "1rem",
							}}
						>
							Rooms
						</Typography.Title>
						<Rooms
							setPickedRoom={
								setPickedRoom
							}
						/>
					</Sider>
					<Layout>
						<Header />
						{pickedRoom && (
							<Room
								room={
									pickedRoom
								}
							/>
						)}
						{/* <Footer>Footer</Footer> */}
					</Layout>
				</Layout>
			)}
		</div>
	);
}
