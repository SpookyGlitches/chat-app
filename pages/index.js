import Head from "next/head";
import Auth from "../components/Auth";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Layout, Space, Typography, Col, Row, List } from "antd";
import PageHeader from "../components/PageHeader";
const { Sider, Content, Footer } = Layout;
import { Router, useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
	const [session, setSession] = useState(null);
	const router = useRouter();
	const user = supabase.auth.user();
	const [joinedRooms, setJoinedRooms] = useState([]);
	useEffect(() => {
		if (!session) {
			setSession(supabase.auth.session());
			supabase.auth.onAuthStateChange((_event, session) => {
				setSession(session);
			});
		} else {
			fetchJoinedRooms();
		}
	}, [session]);

	const fetchJoinedRooms = async () => {
		if (!user) return;
		const { data, error } = await supabase
			.from("room_participants")
			.select(`user_id,joined_at,id,room:room_id(name,id)`)
			.eq("user_id", user.id);
		if (error) alert("Error in retrieving joined rooms");
		setJoinedRooms(data);
	};

	return (
		<div className="container">
			{!session ? (
				<Auth />
			) : (
				<>
					<PageHeader />
					<Row
						align="middle"
						ori
						justify="center"
						style={{ padding: "2.5rem", border: 0 }}
					>
						<Col span={24}>
							<List
								grid={{ gutter: 16, column: 3 }}
								size="large"
								header={
									<Typography.Title level={1}>
										Joined Rooms
									</Typography.Title>
								}
								bordered={false}
								dataSource={joinedRooms}
								renderItem={(item) => (
									<List.Item>
										<Link href={`/rooms/${item.room.id}`}>
											<a>{item.room.name}</a>
										</Link>
									</List.Item>
								)}
							/>
						</Col>
					</Row>
				</>
			)}
		</div>
	);
}
