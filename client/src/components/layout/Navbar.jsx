import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

    const {
        user,
        logout
    } = useAuth();

    const navigate = useNavigate();


    const handleLogout = () => {

        // Supprimer la session
        logout();

        // Rediriger vers Login
        navigate("/login", {
            replace: true
        });

    };


    return (

        <nav
            className="
                h-20
                bg-slate-900
                border-b
                border-slate-800
                flex
                items-center
                justify-between
                px-8
            "
        >

            {/* Logo */}

            <div className="text-xl font-bold text-white">
                DevHelper AI
            </div>


            {/* User */}

            {user && (

                <div className="flex items-center gap-5">

                    <span className="text-slate-300">
                        Hello {user.name}
                    </span>


                    <button
                        onClick={handleLogout}
                        className="
                            bg-red-500
                            hover:bg-red-600
                            px-4
                            py-2
                            rounded-xl
                            text-white
                            transition
                        "
                    >
                        Logout
                    </button>

                </div>

            )}

        </nav>

    );
}