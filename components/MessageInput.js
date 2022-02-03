import { Input } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export default function MessagesInput() {
	const router = useRouter();
	const user = supabase.auth.user();

	const [loading, setLoading] = useState(false);
	const [chatText, setChatText] = useState("");

	const handleTextAreaKeyDown = (e) => {
		if (e.keyCode === 13 && !e.shiftKey) {
			submitChatText();
		}
	};

	useEffect(() => {
		setChatText("");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	const submitChatText = async () => {
		if (loading) return;
		else setLoading(true);

		const { error } = await supabase.from("messages").insert(
			{
				created_by: user.id,
				content: chatText,
				room_id: router.query.id,
			},
			{ returning: "minimal" }
		);

		if (error) {
			alert("Error in sending your message.");
		} else {
			setChatText("");
			setLoading(false);
		}
	};

	const handleTextAreaChange = (e) => {
		setChatText(e.target.value);
	};

	return (
		<>
			<Input.TextArea
				value={chatText}
				disabled={loading}
				onChange={handleTextAreaChange}
				placeholder="Aa"
				onKeyDown={handleTextAreaKeyDown}
				autoSize={{ minRows: 2, maxRows: 6 }}
			/>
		</>
	);
}
