import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const auth = getAuth();
  const navigate = useNavigate();
  signOut(auth)
    .then(() => {
      navigate("/");
    })
    .catch((error) => {
      return alert("Couldn't sign out!");
    });
}
