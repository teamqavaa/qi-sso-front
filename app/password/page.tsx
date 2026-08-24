import { Input } from "@/components/ui/input";

export default function ResetPassword(){
    return (
        <div className="flex justify-center min-h-screen">
            <h2>Enter Your email address to reset your password</h2>
            <form action="">
            <label htmlFor="email">Email</label>
            <Input/>
            </form>
        </div>
    )
}