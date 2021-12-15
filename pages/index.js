import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Auth from "../components/Auth";
import Account from "../components/Account";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
	const [session, setSession] = useState(null);

	useEffect(() => {
		setSession(supabase.auth.session());

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	return (
		<div
			className="container"
			style={{ padding: "50px 0 100px 0" }}
		>
			{!session ? (
				<Auth />
			) : (
				<Account
					key={session.user.id}
					session={session}
				/>
			)}
		</div>
	);
}
