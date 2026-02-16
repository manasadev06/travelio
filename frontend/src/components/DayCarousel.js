import { useState, useRef, useEffect } from "react";
import DayCard from "./DayCard";
import "./DayCarousel.css";

export default function DayCarousel({ days = [] }) {

    const [current, setCurrent] = useState(0);
    const trackRef = useRef(null);
    const [cardWidth, setCardWidth] = useState(0);

    useEffect(() => {
        if (trackRef.current) {
            const firstCard = trackRef.current.querySelector(".card-item");

            if (firstCard) {
                const cardStyle = window.getComputedStyle(firstCard);
                const trackStyle = window.getComputedStyle(trackRef.current);

                const gap = parseInt(trackStyle.gap || 0);
                const width = firstCard.offsetWidth + gap;

                setCardWidth(width);
            }
        }
    }, [days]);


    const next = () => {
        if (current < days.length - 4) {
            setCurrent(current + 1);
        }
    };

    const prev = () => {
        if (current > 0) {
            setCurrent(current - 1);
        }
    };

    return (
        <div className="carousel-wrapper">
            <button className="arrow left" onClick={prev}>❮</button>

            <div className="carousel-outer">
                <div className="carousel-container">
                    <div
                        className="carousel-track"
                        ref={trackRef}
                        style={{
                            transform: `translateX(-${current * cardWidth}px)`
                        }}
                    >
                        {days.map((item) => (
                            <div className="card-item" key={item.day}>
                                <DayCard {...item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button className="arrow right" onClick={next}>❯</button>
        </div>
    );
}


