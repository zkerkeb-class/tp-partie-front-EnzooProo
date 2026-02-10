import { useState, useEffect, useCallback } from 'react';

const useBattleLogic = (playerPokemon, cpuPokemon) => {
    const [playerHP, setPlayerHP] = useState(playerPokemon?.base.HP || 100);
    const [cpuHP, setCpuHP] = useState(cpuPokemon?.base.HP || 100);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [battleLog, setBattleLog] = useState(`Un combat commence entre ${playerPokemon?.name.french} et ${cpuPokemon?.name.french} !`);
    const [isFinished, setIsFinished] = useState(false);
    const [winner, setWinner] = useState(null);
    const [animating, setAnimating] = useState({ player: null, cpu: null, flash: false });

    const maxPlayerHP = playerPokemon?.base.HP || 100;
    const maxCpuHP = cpuPokemon?.base.HP || 100;

    const calculateDamage = (attacker, defender, power) => {
        const attackStat = attacker.base.Attack;
        const defenseStat = defender.base.Defense;
        const randomFactor = 0.85 + Math.random() * 0.15; // 0.85 to 1.0
        const damage = Math.floor((attackStat / defenseStat) * power * randomFactor);
        return Math.max(5, damage); // Minimum 5 damage
    };

    const triggerAnimation = (target, type) => {
        setAnimating(prev => ({ ...prev, [target]: type }));
        setTimeout(() => {
            setAnimating(prev => ({ ...prev, [target]: null }));
        }, 500);
    };

    const playerAction = (actionType) => {
        if (!isPlayerTurn || isFinished) return;

        let damage = 0;
        let logMsg = "";
        let heal = 0;

        switch (actionType) {
            case 'QUICK':
                damage = calculateDamage(playerPokemon, cpuPokemon, 30);
                logMsg = `${playerPokemon.name.french} utilise Vive-Attaque !`;
                triggerAnimation('player', 'thrust');
                setTimeout(() => triggerAnimation('cpu', 'shake'), 300);
                break;
            case 'HEAVY':
                const miss = Math.random() < 0.2;
                if (!miss) {
                    damage = calculateDamage(playerPokemon, cpuPokemon, 60);
                    logMsg = `${playerPokemon.name.french} lance une attaque puissante !`;
                    triggerAnimation('player', 'thrust');
                    setTimeout(() => {
                        triggerAnimation('cpu', 'shake');
                        setAnimating(prev => ({ ...prev, flash: true }));
                        setTimeout(() => setAnimating(prev => ({ ...prev, flash: false })), 100);
                    }, 300);
                } else {
                    logMsg = `${playerPokemon.name.french} rate son attaque !`;
                }
                break;
            case 'HEAL':
                heal = Math.floor(maxPlayerHP * 0.3);
                logMsg = `${playerPokemon.name.french} utilise Soin !`;
                break;
            case 'SPECIAL':
                damage = calculateDamage(playerPokemon, cpuPokemon, 45);
                logMsg = `${playerPokemon.name.french} utilise sa capacité spéciale !`;
                triggerAnimation('player', 'thrust');
                setTimeout(() => triggerAnimation('cpu', 'shake'), 300);
                break;
            default:
                break;
        }

        setBattleLog(logMsg);
        
        if (damage > 0) {
            setCpuHP(prev => {
                const newHP = Math.max(0, prev - damage);
                if (newHP === 0) {
                    setIsFinished(true);
                    setWinner('PLAYER');
                }
                return newHP;
            });
        }

        if (heal > 0) {
            setPlayerHP(prev => Math.min(maxPlayerHP, prev + heal));
        }

        if (!isFinished && winner === null) {
            setIsPlayerTurn(false);
        }
    };

    const cpuTurn = useCallback(() => {
        if (isFinished || isPlayerTurn) return;

        setTimeout(() => {
            const actions = ['QUICK', 'QUICK', 'HEAVY', 'SPECIAL'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            let damage = 0;
            let logMsg = "";

            switch (action) {
                case 'QUICK':
                    damage = calculateDamage(cpuPokemon, playerPokemon, 30);
                    logMsg = `${cpuPokemon.name.french} adverse utilise Charge !`;
                    triggerAnimation('cpu', 'thrust');
                    setTimeout(() => triggerAnimation('player', 'shake'), 300);
                    break;
                case 'HEAVY':
                    damage = calculateDamage(cpuPokemon, playerPokemon, 50);
                    logMsg = `${cpuPokemon.name.french} adverse utilise Ultralaser !`;
                    triggerAnimation('cpu', 'thrust');
                    setTimeout(() => {
                        triggerAnimation('player', 'shake');
                        setAnimating(prev => ({ ...prev, flash: true }));
                        setTimeout(() => setAnimating(prev => ({ ...prev, flash: false })), 100);
                    }, 300);
                    break;
                case 'SPECIAL':
                    damage = calculateDamage(cpuPokemon, playerPokemon, 40);
                    logMsg = `${cpuPokemon.name.french} adverse utilise une attaque obscure !`;
                    triggerAnimation('cpu', 'thrust');
                    setTimeout(() => triggerAnimation('player', 'shake'), 300);
                    break;
            }

            setBattleLog(logMsg);
            
            if (damage > 0) {
                setPlayerHP(prev => {
                    const newHP = Math.max(0, prev - damage);
                    if (newHP === 0) {
                        setIsFinished(true);
                        setWinner('CPU');
                    }
                    return newHP;
                });
            }

            setIsPlayerTurn(true);
        }, 1500);
    }, [isFinished, isPlayerTurn, cpuPokemon, playerPokemon, maxPlayerHP]);

    useEffect(() => {
        if (!isPlayerTurn && !isFinished) {
            cpuTurn();
        }
    }, [isPlayerTurn, isFinished, cpuTurn]);

    return {
        playerHP,
        cpuHP,
        maxPlayerHP,
        maxCpuHP,
        isPlayerTurn,
        battleLog,
        isFinished,
        winner,
        animating,
        playerAction
    };
};

export default useBattleLogic;
