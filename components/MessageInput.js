import { Input } from "antd";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export default function MessagesInput({ room }) {
	const [chatText, setChatText] = useState("");
	const user = supabase.auth.user();

	const handleTextAreaKeyDown = (e) => {
		if (e.keyCode === 13 && !e.shiftKey) {
			submitChatText();
		}
	};

	useEffect(() => {
		setChatText("");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [room]);
	const submitChatText = async () => {
		const { error } = await supabase.from("messages").insert(
			{
				created_by: user.id,
				content: chatText,
				room_id: room.id,
			},
			{ returning: "minimal" }
		);
		if (error) alert("Error in sending your message.");
		else setChatText("");
	};

	const handleTextAreaChange = (e) => {
		setChatText(e.target.value);
	};
	return (
		<>
			<Input.TextArea
				value={chatText}
				onChange={handleTextAreaChange}
				placeholder="Aa"
				onKeyDown={handleTextAreaKeyDown}
				autoSize={{ minRows: 2, maxRows: 6 }}
			/>
		</>
	);
}
