import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import UserFeatures from '../components/Game/UserFeatures'
import BootFeatures from '../components/Game/BootFeatures'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import Carousel from '../components/Game/Carousel'

const Game = (props) => {
    // se puede usar un useReducer para evitar tantos useStates
    const navigate = useNavigate()
    const [userNft, setUserNft] = useState('')
    const [bootNft, setbootNft] = useState('')
    const [isSelected, setIsSelected] = useState(false)
    const [isUserTurn, setIsUserTurn] = useState(true)
    const [userAttacked, setUserAttacked] = useState(false)
    const [userHp, setUserHp] = useState()
    const [bootHp, setBootHp] = useState()
    const [storyteller, setStoryteller] = useState('')
    const [stage, setStage] = useState('')
    const animated = useRef()
    const animatedBoot = useRef()

    useEffect(() => {
        const pickRandomStage = Math.floor((Math.random() * (4) + 1))
        const arrayEscenarios = ["/assets/stage-1.jfif", "/assets/stage-2.jpg", "/assets/stage-3.jpg", "/assets/stage-4.png", "/assets/stage-5.jpg"]
        const filteredBoots = props.rdxNfts.filter(boot => boot.type === "Gamer")
        const rdn = Math.floor((Math.random() * ((filteredBoots.length - 1) + 1)))
        setbootNft(filteredBoots[rdn])
        filteredBoots[rdn] && setBootHp(filteredBoots[rdn].features.hp)
        setStage(arrayEscenarios[pickRandomStage])

    }, [props.rdxNfts])// eslint-disable-line react-hooks/exhaustive-deps

    const handlerChoice = (nftSelected) => {
        const filterChoice = props.rdxNftsByUser.findIndex(nft => nft.name === nftSelected)
        setUserHp(props.rdxNftsByUser[filterChoice].features.hp)
        setUserNft(props.rdxNftsByUser[filterChoice])
        setIsSelected(true)

    }
    const leaveHandler = () => {
        Swal.fire({
            title: 'Are you sure want to leave?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `Still fighting`,
        }).then((result) => {
            if (result.isConfirmed) {
                initialState()
                navigate('/')
            } else if (result.isDenied) {

            }

        })
    }
    const initialState = () => {
        const filteredBoots = props.rdxNfts.filter(boot => boot.type === "Gamer")
        const rdn = Math.floor((Math.random() * ((filteredBoots.length - 1) + 1)))

        setIsSelected(false) // set aux user (nft inicial) y aux boot
        setUserAttacked(false)
        userNft.features.hp = userHp
        bootNft.features.hp = bootHp
        setbootNft(filteredBoots[rdn])
    }
    const attackHandler = (attack) => {
        const damage = Math.floor(attack.damage + ((Math.random() * ((bootNft.features.hp / 2) - 1)) + 1))
        bootNft.features.hp -= damage

        setStoryteller(`The NFT ${userNft.name} attacks with ${attack.name} and his damaga was ${damage}`)
        // si cuando ataca la vida del bootNft es menor o igual que cero , el usuario gana
        if (bootNft.features.hp <= 0) {
            // se pregunta si quiere volver a jugar, ganaste loco boludo
            bootNft.features.hp = 0
            setIsUserTurn(true)
            setUserAttacked(true)
            Swal.fire({
                title: 'You win!',
                showDenyButton: true,
                confirmButtonText: 'Play Again',
                denyButtonText: `Back To Home`,
            }).then((result) => {
                if (result.isConfirmed) {
                    initialState()
                } else if (result.isDenied) {
                    navigate('/')
                    initialState()
                }

            })
        } else {
            animated.current.style.transition = 'transform 1s'
            animated.current.style.transform = 'translate(280px,-120px)'
            setTimeout(() => {
                animated.current.style.transition = 'transform 1s'
                animated.current.style.transform = 'translate(0px,0px)'
            }, 1000)
            setTimeout(() => {
                setUserAttacked(true)
                setIsUserTurn(false)
            }, 4000)
        }
    }
    useEffect(() => {
        if (!isUserTurn) {
            // es turno del boot y le quita vida al nft del usuario

            const rdnAttack = Math.floor((Math.random() * ((bootNft.features.habilities.length - 1) + 1)))
            const attack = bootNft.features.habilities[rdnAttack]
            const damage = Math.floor(attack.damage + ((Math.random() * ((userNft.features.hp / 2) - 1)) + 1))
            userNft.features.hp -= damage
            // si cuando ataca la vida del userNft es menor o igual que cero , el usuario gana
            setStoryteller(`The NFT '${bootNft.name}' attacks with '${attack.name}' and his damage was ${damage}`)
            animatedBoot.current.style.transition = 'transform 1s'
            animatedBoot.current.style.transform = 'translate(-280px,120px)'
            setTimeout(() => {
                animatedBoot.current.style.transition = 'transform 1s'
                animatedBoot.current.style.transform = 'translate(0px,0px)'
            }, 1000)
            if (userNft.features.hp <= 0) {
                // se pregunta si quiere volver a jugar y se muestra un mensaje , Re papafrita loco
                userNft.features.hp = 0
                setIsUserTurn(true)
                setUserAttacked(false)
                Swal.fire({
                    title: 'You Lose!',
                    showDenyButton: true,
                    confirmButtonText: 'Play Again',
                    denyButtonText: `Back To Home`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        initialState()
                    } else if (result.isDenied) {
                        navigate('/')
                        initialState()
                    }
                })
            } else {
                setTimeout(() => {
                    setUserAttacked(false)
                    setIsUserTurn(true)
                }, 4000)
            }
        }
    }, [isUserTurn])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <div style={{ height: "70px" }} ></div>
            <div className='main-content'>
                {!isSelected &&
                    <>
                        <h2 className='choice-title'>Welcome "userName", Choose your NFT</h2>
                        <div className='choice-nfts-card'>
                            {props.rdxNftsByUser.length === 0 ? <div className="nfts-loading-container"><div className="nfts-loading" style={{ backgroundImage: `url(/assets/loading_gif.gif)` }} /></div> : <Carousel choice={handlerChoice} nfts={props.rdxNftsByUser} />}
                        </div>
                    </>
                }
                {(isSelected) &&
                    <div className='main-content-battle'>
                        <div className='stage' style={{ backgroundImage: `url(${stage})` }}>
                            <div className='arena-battle' >
                                <div className='boot-box'>
                                    <BootFeatures features={bootNft} />
                                    <div className='nft-img-container-boot'>
                                        <div ref={animated} className='nft-img' style={{ backgroundImage: `url(${userNft.img})` }}></div>
                                        <div className='nft-stage-container'>

                                            <div className='nft-stage'></div>
                                        </div>
                                    </div>
                                </div>
                                <div className='user-box' >
                                    <div className='nft-img-container-boot'>

                                        {bootNft && <div ref={animatedBoot} className='nft-img' style={{ backgroundImage: `url(${bootNft.img})` }}></div>}
                                        <div className='nft-stage-container'>

                                            <div className='nft-stage'></div>
                                        </div>
                                    </div>

                                    {userNft && <UserFeatures features={userNft} />}
                                </div>
                            </div>
                            {!userAttacked &&
                                <div className='abilities-container'>

                                    {userNft && userNft.features.habilities.map(hability => <button className='ability-action' key={hability.name} onClick={() => attackHandler(hability)}>{hability.name}</button>)}
                                    <div className='option-panel'>
                                        {!userAttacked && <button onClick={leaveHandler}>Abandonar</button>}
                                    </div>
                                </div>
                            }
                            {userAttacked &&
                                <div className='storyteller'>
                                    <p>{storyteller}</p>
                                </div>
                            }

                        </div>
                    </div>
                }
            </div>
        </>

    )
}
const mapStateToProps = (state) => ({
    rdxNfts: state.nftReducers.nfts,
    rdxNftsByUser: state.nftReducers.userNfts,
    rdxuser: state.userReducers.user
})
export default connect(mapStateToProps, null)(Game)
