import { Layout, Skeleton } from "antd";
import { Menu } from "antd";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function JoinedRooms() {
	const [rooms, setRooms] = useState([]);

	const user = supabase.auth.user();
	const router = useRouter();

	const fetchRooms = async () => {
		const { data, error } = await supabase
			.from("room_participants")
			.select(`user_id,joined_at,id,room:room_id(name,id)`)
			.eq("user_id", user.id);
		if (error) console.error(error);
		setRooms(data);
	};

	useEffect(() => {
		fetchRooms();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Menu selectedKeys={router.query.id} style={{ padding: "1.5rem 0" }}>
			{rooms.map((room) => (
				<Menu.Item key={room.room.id}>
					<Link href={`/rooms/${room.room.id}`}>
						<a>{room.room.name}</a>
					</Link>
				</Menu.Item>
			))}
		</Menu>
	);
}
