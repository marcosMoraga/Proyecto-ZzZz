import react, {useRef} from "react"
import { toast } from 'react-toastify';

const SignIn = (props) => {

    const Email = useRef()
    const Password = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()


        const user = {
            email :  Email.current.value,
            password :  Password.current.value
        }
        const userResponse = await props.signin(user)
        console.log(userResponse)
        userResponse.succes 
            ? 
            toast.success('Welcom to the NFT world', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            }) 
            
            : toast.warn(userResponse.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            if(userResponse.succes === true){
                Email.current.value = ""
                Password.current.value = ""
            }
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" ref={Email} placeholder="Pepe@gmail.com" />
                <input type="password" ref={Password} placeholder="*****" />
                <button tpye="submit">Log in</button>
            </form> 
        </>
    )
}

export default SignIn
