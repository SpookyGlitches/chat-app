import { Layout, Typography, Menu } from "antd";
import { useState, useContext } from "react";
import { Input, Row, Col, Space, Button, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";
import { useEffect } from "react/cjs/react.development";
import { useRouter } from "next/router";

export default function Header() {
	const router = useRouter();
	const [current, setCurrent] = useState(router.pathname);

	const handleSignOutClick = async () => {
		await supabase.auth.signOut();
		router.push("/");
	};

	return (
		<Menu theme="dark" mode="horizontal" selectedKeys={[current]}>
			<Menu.Item key="/">
				<Link href="/">
					<a>Joined Rooms</a>
				</Link>
			</Menu.Item>
			<Menu.Item key="/rooms">
				<Link href="/rooms">
					<a>All Rooms</a>
				</Link>
			</Menu.Item>
			<Menu.Item key="/profile">
				<Link href="/profile">
					<a>Profile</a>
				</Link>
			</Menu.Item>
			<Menu.Item
				style={{ marginLeft: "auto" }}
				onClick={handleSignOutClick}
			>
				Sign Out
			</Menu.Item>
		</Menu>
	);
}
