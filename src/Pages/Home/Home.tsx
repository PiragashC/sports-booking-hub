import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Home.css';
import './Home-responsive.css';
import { Button } from "primereact/button";
import { Slide, Fade, Zoom } from "react-awesome-reveal";

import { goToTop } from "../../Components/GoToTop";
import { Features, features } from "./HomeData";

const Home: React.FC = () => {
    const navigate = useNavigate();

    const [featuresData, setFeaturesData] = useState<Features[]>([]);

    useEffect(() => {
        setFeaturesData(features);
    }, []);

    const handleNavigateBooking = () => {
        navigate(`/booking`);
        goToTop();
    }

    return (
        <>
            <section className="home_hero_section page_init_section overflow-hidden" id="home">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <article className="home_hero_content">
                                <Slide direction="up" triggerOnce>
                                    <h1>
                                        Welcome to <span>Kover&nbsp;<span>Drive</span></span> Sports
                                    </h1>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <h2>
                                        London’s Premier Indoor Cricket and Multi-Sport Facility!
                                    </h2>
                                </Slide>

                                <Slide direction="up" delay={200} triggerOnce>
                                    <p>
                                        Experience London’s ultimate indoor cricket and multi-sport destination! Train with top-quality lanes, pro-grade nets, and advanced pitching machines. With baseball and table tennis coming soon, the game never stops. Book your session today! 🚀🏏
                                    </p>
                                </Slide>

                                <Zoom delay={200} duration={1500} triggerOnce>
                                    <div className="home_hero_buttons">
                                        <Button
                                            label="Book Cricket Lane"
                                            className="custom_button primary"
                                            onClick={handleNavigateBooking}
                                        />

                                        <Button
                                            label="Learn More"
                                            className="custom_button secondary"
                                        />
                                    </div>
                                </Zoom>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page_section about_section" id="about">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 col-xl-6">
                            <div className="section_body">
                                <Slide direction="up" triggerOnce>
                                    <h3 className="section_title">
                                        About Kover Drive Sports
                                    </h3>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <h5 className="section_sub_title">
                                        Elevating Indoor Sports in London, Ontario
                                    </h5>
                                </Slide>

                                <div className="section_content">
                                    <Fade triggerOnce>
                                        <p className="section_desc">
                                            Kover Drive Sports is London’s premier indoor cricket and multi-sport facility, built for athletes of all levels. Our state-of-the-art lanes, professional-grade nets, and advanced pitching machines create the perfect training environment, no matter the season. Committed to skill development and community engagement, we provide a space where players can train, compete, and grow. With baseball and table tennis coming soon, we’re expanding opportunities for all sports enthusiasts. Join us and be part of London’s thriving sports community!
                                        </p>
                                    </Fade>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6">
                            <div className="section_image_area">
                                <Zoom triggerOnce duration={1500} className="w-100">
                                    <img src="/kover_drive_logo.png" alt="" />
                                </Zoom>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page_section features_section" id="features">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <div className="section_body">
                                <Slide direction="up" triggerOnce>
                                    <h3 className="section_title text-center">
                                        Key Features of Kover Drive Sports
                                    </h3>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <h5 className="section_sub_title text-center">
                                        Discover What Makes Us the Ultimate Indoor Sports Destination
                                    </h5>
                                </Slide>

                                <div className="section_content">
                                    {featuresData && featuresData?.length > 0 && (
                                        <div className="row features_row">
                                            {featuresData?.map((feature, index) => (
                                                <div key={feature?.id} className="col-12 col-xl-4 col-md-6 features_col">
                                                    <Slide direction="up" delay={index * 50} triggerOnce className="feature_card_area h-100">
                                                        <article className="feature_card">
                                                            <div className="feature_card_header">
                                                                <h5 className="feature_title">
                                                                    {feature?.name}
                                                                </h5>
                                                            </div>

                                                            <div className="feature_card_body">
                                                                <p className="feature_desc">
                                                                    {feature?.description}
                                                                </p>
                                                            </div>
                                                        </article>
                                                    </Slide>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
