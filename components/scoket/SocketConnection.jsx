"use client";
import React from "react";
import { useEffect, useState } from "react";
import { connect } from "socket.io-client";
import { useSession } from "next-auth/react";
import { getUserMeAction } from "@/action/auth-action";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const SocketContext = React.createContext({
    socket: null,
    SocketConnection: () => { },
});

const SocketProvider = ({ children }) => {
    const { data: session } = useSession();
    const [socket, setSocket] = useState(null);
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

    const SocketConnection = (token) => {
        if (!token) {
            console.error("Token is null. Socket connection won't be established.");
            return;
        }

        const newSocket = connect(baseURL, {
            extraHeaders: {
                token: `${token}`,
            },
        });

        newSocket.emit("join:private", {}, (message) => {
            // console.log(message);
        });

        newSocket.emit("join:company", {}, (message) => {
            //console.log("join:company",message);
        });

        // newSocket.on("message", (newMessage) => {
        // console.log(newMessage);
        // });


        newSocket.on("notification", (data) => {



            try {
                const notification = typeof data === 'string' ? JSON.parse(data) : data;

            } catch (error) {
                // console.error("Failed to parse notification data:", error);
            }
        });


        //for task

        newSocket.on("task-updated", (data) => {



            try {
                const taskNotification = typeof data === 'string' ? JSON.parse(data) : data;

            } catch (error) {
                // console.error("Failed to parse notification data:", error);
            }
        });



        setSocket(newSocket);
    };

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };





    useEffect(() => {
        if (session) {
            const token = localStorage.getItem("token");
            // console.log("token :-", session?.jwt);
            SocketConnection(session?.jwt);
        } else {
            console.error(
                "Access token not available. Socket connection won't be established."
            );
        }

        return () => {
            disconnectSocket();
        };
    }, [session]);

    return (
        <SocketContext.Provider value={{ socket, SocketConnection }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;