import { useState } from "react";
const tripType = "snow"; // this will later come from search result
const backgroundStyles = {
    snow: "linear-gradient(to bottom, #e6f2ff, #ffffff)",
    forest: "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)",
    desert: "linear-gradient(to bottom, #f6d365, #fda085)",
    beach: "linear-gradient(to bottom, #2193b0, #6dd5ed)"
};

export default function DayCard({ day, title, theme, image, places }) {
    const [hovered, setHovered] = useState(false);

    return (

        

        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: "300px",
                borderRadius: "20px",
                position: "relative",
                overflow: "hidden",
                padding: "0px",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: hovered
                    ? "0 12px 30px rgba(0,0,0,0.15)"
                    : "0 4px 20px rgba(0,0,0,0.1)",
                transform: hovered ? "translateY(-6px)" : "translateY(0)",
                transformOrigin: "center center",

                zIndex: hovered ? 5 : 1,

                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
            }}
        >
            <div
                style={{
                    padding: "20px",
                    maxHeight: hovered ? "700px" : "120px",
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                }}
            >

            <h2 style={{ marginBottom: "6px", fontSize: "20px" }}>
                    Day {day} – {title}
                </h2>

                <p style={{ marginBottom: "12px", color: "#555" }}>
                    Theme: {theme}
                </p>


                <div
                    style={{
                        padding: "20px",
                    }}
                ></div>


                <ul style={{ marginTop: "10px" }}>
                    {places.map((place, index) => (
                        <li key={index}>{place}</li>
                    ))}
                </ul>


                <img
                    src={image}
                    alt={title}
                    style={{
                        width: "100%",
                        borderRadius: "12px",
                        marginTop: "15px",
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? "scale(1)" : "scale(0.95)",
                        transition: "all 0.3s ease",
                    }}
                />






            </div>
        </div>
    );


}
