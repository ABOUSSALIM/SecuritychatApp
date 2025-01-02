import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import axios from "axios";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch,faSignOutAlt, faCogs, faPlusSquare as faPlusSquareO, faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import './Chap.css';

let stompClient = null;

const Chap = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("Conversation");
    const [userData, setUserData] = useState({
        username:'',
        receivername: '',
        connected: false,
        message: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        console.log(userData);
    }, [userData]);



    
        const accessToken = Cookies.get("accessToken");  
        
        if (!accessToken) {
            console.warn("Token manquant, redirection vers la page de connexion.");
            navigate("/login");
            return;
        }


    const connect = () => {
        const Sock = new SockJS('http://localhost:8083/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData(prevData => ({ ...prevData, connected: true }));
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe(`/user/${userData.username}/private`, onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
        const chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload) => {
        const payloadData = JSON.parse(payload.body);
        const senderChats = privateChats.get(payloadData.senderName) || [];
        senderChats.push(payloadData);
        privateChats.set(payloadData.senderName, senderChats);
        setPrivateChats(new Map(privateChats));
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData(prevData => ({ ...prevData, message: value }));
    }

    const sendMessage = (isPrivate = false) => {
        if (stompClient) {
            const chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };

            if (isPrivate) {
                chatMessage.receiverName = tab;
                if (userData.username !== tab) {
                    const updatedChats = new Map(privateChats);
                    updatedChats.get(tab)?.push(chatMessage);
                    setPrivateChats(updatedChats);
                }
                stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            } else {
                stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
                setPublicChats(prevChats => [...prevChats, chatMessage]);
            }

            setUserData(prevData => ({ ...prevData, message: "" }));
        }
    }

    const handleUsername = (event) => {
        const { value } = event.target;
        setUserData(prevData => ({ ...prevData, username: value }));
    }

    const registerUser = () => {
        connect();
    }

  const handleLogout = () => {
    Cookies.remove("accessToken");  
    Cookies.remove("refreshToken"); 
    navigate("/login");  
  };


    
    return (
        <div className="container">
            
            {userData.connected ? (
                <div className="chat_container">
                    
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card chat-app">
                                
                                <div id="plist" className="people-list">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg> </span>
                                        </div>
                                        <input type="text" className="form-control" placeholder="Search..." />
                                    </div>
                                    <ul className="list-unstyled chat-list mt-2 mb-0">
                                        <li className={`clearfix ${tab === "CHATROOM" ? "active" : ""}`} onClick={() => setTab("CHATROOM")}>
                                            <div className="about">
                                                <div className="name">Groupe ISIC 2</div>
                                            </div>
                                        </li>
                                        {[...privateChats.keys()].map((name, index) => (
                                            <li className={`clearfix ${tab === name ? "active" : ""}`} key={index} onClick={() => setTab(name)}>
                                                <div className="about">
                                                    <div className="name">{name}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="chat">
                                    <div className="chat-header clearfix">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUZEpyaO4ntfYD_RPo2EO4BbkAr72n3drPel9boWYhN4BWz0l_J6z5vGJp8IWEqwXXk9s&usqp=CAU" alt="avatar" />
                                                </a>
                                                <div className="chat-about">
                                                    <h6 className="m-b-0">{tab}</h6>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 hidden-sm text-right">
                                                  
                                                <button className="btn btn-outline-secondary"><FontAwesomeIcon icon={faPlusSquareO} /></button>
                                                <button className="btn btn-outline-primary"><FontAwesomeIcon icon={faCogs} /></button>
                                                <button className="btn btn-inline-danger" onClick={handleLogout}> logout <FontAwesomeIcon icon={faSignOutAlt} /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chat-history">
                                        <ul className="m-b-0">
                                            {(tab === "CHATROOM" ? publicChats : privateChats.get(tab) || []).map((chat, index) => (
                                                <li className="clearfix" key={index}>
                                                    
                                                    <div className={`message-data ${chat.senderName === userData.username ? "text-right" : ""}`}>
                                                        
                                                    <img src="data:image/png;base64,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" alt="avatar" />
                                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                                    </div>
                                                    <div className={`message ${chat.senderName === userData.username ? "other-message float-right" : "my-message"}`}>
                                                        
                                                        {chat.message}
                                                        <span className="message-data-time">{new Date().toLocaleTimeString()}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="chat-message clearfix">
                                        <div className="input-group mb-0">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"><FontAwesomeIcon icon={faCloudUpload} size="2x" /></span>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Enter text here..."
                                                value={userData.message} 
                                                onChange={handleMessage}
                                            />
                                            <div className="input-group-append" >
                                                <button 
                                                    className="btn btn-outline-secondary" 
                                                    type="button"
                                                    onClick={() => sendMessage(tab !== "CHATROOM")}
                                                >
                                               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
</svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="register">
                <input
                  id="user-name"
                  placeholder="Visible avec"
                  name="userName"
                  value={userData.username}
                  onChange={handleUsername}
                  className="form-control mb-3"
                />
                <button
                  type="button"
                  className="btn btn-primary w-100 d-flex justify-content-center align-items-center py-2"
                  onClick={registerUser}
                >
                  En ligne
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person-bounding-box ms-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5"/>
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                  </svg>
                </button>
              </div>
              
            )}
        </div>
    );
}

export default Chap;
