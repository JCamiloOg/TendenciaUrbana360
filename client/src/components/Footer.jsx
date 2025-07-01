import logo from "../assets/TendenciaUrbanaLogoTransparente.svg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faWhatsapp, faTiktok } from "@fortawesome/free-brands-svg-icons"
import "../style/footer.css"
import { generateBubbles } from "../hooks/useBubbles";

export default function Footer({ count = 250 }) {
    const bubbles = generateBubbles(count);
    return (
        <div className="bodyFooter mt-20">
            <div className="footer">
                <div className="bubbles">
                    {
                        bubbles.map(({ id, style }) => (
                            <div key={id} className="bubble" style={style}></div>
                        ))
                    }
                </div>
                <div className="content">
                    <div>
                        <div><b>Tendencia Urbana 360</b><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a>
                        </div>
                        <div><b></b><a href="https://www.instagram.com/tendencia.urbana.shop/"><FontAwesomeIcon
                            icon={faInstagram} /></a><a href="https://wa.link/2ppfsc"><FontAwesomeIcon
                                icon={faWhatsapp} /></a><a href="https://www.tiktok.com/@tendenciaurbana.360"><FontAwesomeIcon
                                    icon={faTiktok} /></a><a href="#"></a></div>
                    </div>
                    <div><Link className="image page-scroll" to="/" target="_blank"
                        style={{ backgroundImage: `url("${logo}")` }}></Link>
                        <p>© {new Date().getFullYear()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}