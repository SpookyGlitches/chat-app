import { Layout } from "antd";
import { Menu } from "antd";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";

export default function Rooms({ setPickedRoom }) {
	const [rooms, setRooms] = useState([]);

	const fetchRooms = async () => {
		const { data, error } = await supabase
			.from("rooms")
			.select()
			.order("created_at", { ascending: false });
		if (error) return;
		setRooms(data);
	};
	const addRoom = (room) => {
		setRooms((prevState) => [room.new, ...prevState]);
	};

	useEffect(() => {
		fetchRooms();
		const subscribeToRooms = supabase
			.from("rooms")
			.on("INSERT", (payload) => addRoom(payload))
			.subscribe();
		return () => supabase.removeSubscription(subscribeToRooms);
	}, []);

	const roomElements = rooms.map((room) => (
		<Menu.Item key={room.id} onClick={() => setPickedRoom(room)}>
			{room.name}
		</Menu.Item>
	));

	return <Menu theme="dark">{roomElements}</Menu>;
}
