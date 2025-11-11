import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Socket } from '../../api/client';
import './style.css';
import { useLocation } from 'react-router';

export default function Login() {
    const [msg, setMsg] = useState("");
    const [itens, setItens] = useState([]);
    const location = useLocation();
    const { nome } = location.state || {};
    const [salaAtual, setSalaAtual] = useState("");
    const navigate = useNavigate();

    function adicionarItem(msg) {
        setItens(prev => [...prev, msg]);
    }

    function enviarMsg() {
        if (!msg.trim()) return alert("Digite uma mensagem antes de enviar!");
        const msgObj = { nome, texto: msg, sala: salaAtual };
        Socket.emit('mensagem', msgObj);
        setMsg('');
    }

    useEffect(() => {
        Socket.on('mensagem', (msg) => {
            console.log("Mensagem recebida:", msg);
            adicionarItem(msg);
        });

        Socket.on('disconnect', () => {
            console.log('Desconectado do servidor');
            alert('Conexão perdida. Retornando para o login.');
            navigate('/');
        });

        return () => {
            Socket.off('mensagem');
            Socket.off('disconnect');
        };
    }, [navigate]);

    function entrarSala(nomeSala) {
        if (salaAtual === nomeSala) return;
        const confirmar = window.confirm(`Entrar em ${nomeSala}?`);
        if (!confirmar) return;
        setSalaAtual(nomeSala);
        Socket.emit('entrarSala', nomeSala);
        setItens([]);
    }

    function sairDoChat() {
        const confirmar = window.confirm("Deseja se desconectar?");
        if (!confirmar) return;
        Socket.disconnect();
        navigate('/');
    }

    return (
        <div className='tela'>
            <div className='painel'>
                {["Bate Papo 1", "Bate Papo 2", "Bate Papo 3"].map((nomeSala, i) => (
                    <div
                        key={i}
                        className={`conversa ${salaAtual === nomeSala ? "ativa" : ""}`}
                        onClick={() => entrarSala(nomeSala)}
                    >
                        {nomeSala}
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                            <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318z" />
                        </svg>
                    </div>
                ))}

                <button className="button sair" onClick={sairDoChat}>
                    Sair
                </button>
            </div>
            
            <div className="chat">
                {salaAtual ? (
                    <>
                        <div className="mensagens-container">
                            <ul className="mensagens">
                                {itens.map((item, index) => (
                                    <li key={index}>
                                        <div className="username">{item.nome}</div>
                                        <div>{item.texto}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="input-painel">
                            <input
                                className="input"
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                                placeholder="Digite sua mensagem"
                                onKeyDown={(e) => e.key === 'Enter' && enviarMsg()}
                            />
                            <div className="button" onClick={enviarMsg}>Enviar</div>
                        </div>
                    </>
                ) : (
                    <div className="aviso-card">
                        <p>Escolha uma sala de bate-papo para começar a conversar!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
