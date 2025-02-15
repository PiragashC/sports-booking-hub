import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Home.css';
import './Home-responsive.css';
import { Button } from "primereact/button";
import { Slide, Fade, Zoom } from "react-awesome-reveal";

import { goToTop } from "../../Components/GoToTop";
import { Features, features } from "./HomeData";
import TextInput from "../../Components/TextInput";
import TextArea from "../../Components/TextArea";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const [featuresData, setFeaturesData] = useState<Features[]>([]);

    useEffect(() => {
        setFeaturesData(features);
    }, []);

    const handleNavigateBooking = () => {
        navigate(`/booking`);
        goToTop();
    }

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const [nameError, setNameError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [subjectError, setSubjectError] = useState<string>('');
    const [messageError, setMessageError] = useState<string>('');

    const handleClearFormFields = () => {
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
    }

    const handleClearFormErrors = () => {
        setNameError('');
        setEmailError('');
        setSubjectError('');
        setMessageError('');
    }

    const handleSubmitContactForm = (e: React.FormEvent) => {
        e.preventDefault();
    }


    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>
            {/* Hero section */}
            <section className="home_hero_section page_init_section overflow-hidden" id="home">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <article className="home_hero_content">
                                <Slide direction="up" triggerOnce>
                                    <h1>
                                        Welcome to <span>Kover<span>Drive</span></span> Sports
                                    </h1>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <h2>
                                        London’s Premier Indoor Cricket and Multi-Sport Facility!
                                    </h2>
                                </Slide>

                                <Slide direction="up" delay={200} triggerOnce>
                                    <p>
                                        Experience London’s ultimate indoor cricket and multi-sport destination! Train with top-quality lanes, pro-grade nets, and advanced pitching machines. With baseball and table tennis coming soon, the game never stops. Book your session today!
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
                                            label="Awaiting More Facilities"
                                            className="custom_button secondary"
                                            onClick={() => scrollToSection("features")}
                                        />
                                    </div>
                                </Zoom>
                            </article>
                        </div>

                        <div className="col-12 col-xl-5 mx-auto">
                            <Slide direction="up" triggerOnce delay={100}>
                                <article className="home_hero_card">
                                    <div className="home_hero_card_header">
                                        <h4>Book Cricket Lane</h4>
                                    </div>

                                    <div className="home_hero_card_body">
                                        <p><i className="bi bi-clock-fill me-1"></i> Daily</p>
                                        <p>8 am – 10 pm</p>
                                    </div>

                                    <div className="home_hero_card_footer">
                                        <h3>$40/hr
                                            <span> + Tax</span>
                                        </h3>
                                    </div>
                                </article>
                            </Slide>
                        </div>
                    </div>
                </div>
            </section>
            {/*  */}

            {/* About section */}
            <section className="page_section about_section" id="about">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 col-xl-6 d-flex align-items-center">
                            <div className="section_body">
                                <Slide direction="up" triggerOnce>
                                    <h3 className="section_title">
                                        <span>About</span> Kover Drive Sports
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
                                            Welcome to Kover Drive, the premier indoor cricket and baseball facility dedicated to fostering a love for the game while promoting fitness and skill development. Our mission is to create a vibrant community where players of all ages and skill levels can come together to enhance their abilities, build confidence, and enjoy the thrill of sports. At Kover Drive, we understand that every player has unique goals, whether you’re a beginner looking to learn the basics or an experienced athlete aiming to refine your technique. Our state of the-art facility is equipped with top-notch training equipment, batting cages, and practice areas designed to help you elevate your game.
                                        </p>

                                        <p className="section_desc">
                                            Our facility provides a welcoming environment where you can work on your strength, agility, and endurance, ensuring you are at your best both on and off the field.
                                        </p>

                                        <p className="section_desc">
                                            Join us at Kover Drive and become part of a community that celebrates the spirit of cricket and baseball. Whether you’re here to improve your game, meet new friends, or simply enjoy the sport, we are excited to support you on your journey. Together, let’s hit new heights in your athletic pursuits!
                                        </p>

                                        <p className="section_desc">
                                            Contact Us today to learn more about our programs, schedule a visit, or book a session. We can’t wait to see you on the field!
                                        </p>
                                    </Fade>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6">
                            <Fade triggerOnce duration={1500} className="w-100">
                                <div className="section_image_area">
                                    <img src="/web_assets/home/about_img.png" alt="" />
                                </div>
                            </Fade>
                        </div>
                    </div>
                </div>
            </section>
            {/*  */}

            {/* Feature section */}
            <section className="page_section features_section" id="features">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <div className="section_body">
                                <Slide direction="up" triggerOnce>
                                    <h3 className="section_title text-center">
                                        <span>Key Features</span> of Kover Drive Sports
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
                                                                <div className="feature_icon_area">
                                                                    <img src={feature?.icon} alt={feature?.name} />
                                                                </div>
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
            {/*  */}

            {/* Contact us section */}
            <section className="page_section contact_us_section" id="contact">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <div className="section_body">
                                <Slide direction="up" triggerOnce>
                                    <h3 className="section_title text-center">
                                        <span>Get is touch</span> with us
                                    </h3>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <h5 className="section_sub_title text-center">
                                        We're Here to Help – Reach Out Today!
                                    </h5>
                                </Slide>

                                <div className="section_content">
                                    <div className="row">
                                        <div className="col-12 col-md-4">
                                            <Zoom triggerOnce className="h-100">
                                                <article className="contact_us_card">
                                                    <div className="contact_card_icon">
                                                        <i className="bi bi-geo-alt-fill"></i>
                                                    </div>
                                                    <h4 className="contact_card_head">
                                                        Location
                                                    </h4>
                                                    <div className="contact_card_link_group">
                                                        <Link to={`https://maps.app.goo.gl/uMLQimJ1LNyDjt5d9`} target="_blank">
                                                            Oxbury Mall, 1295 Oxford St E, London, ON N5Y 4W4
                                                        </Link>
                                                    </div>
                                                </article>
                                            </Zoom>
                                        </div>

                                        <div className="col-12 col-md-4">
                                            <Zoom triggerOnce delay={100} className="h-100">
                                                <article className="contact_us_card high_lighted">
                                                    <div className="contact_card_icon">
                                                        <i className="bi bi-telephone-fill"></i>
                                                    </div>
                                                    <h4 className="contact_card_head">
                                                        Give us a call
                                                    </h4>
                                                    <div className="contact_card_link_group">
                                                        <Link to={`tel:+14036811246`}>
                                                            +1 (403) 681-1246
                                                        </Link>
                                                        <span>|</span>
                                                        <Link to={`tel:+15197022683`}>
                                                            +1 (519) 702-2683
                                                        </Link>
                                                    </div>
                                                </article>
                                            </Zoom>
                                        </div>

                                        <div className="col-12 col-md-4">
                                            <Zoom triggerOnce delay={200} className="h-100">
                                                <article className="contact_us_card">
                                                    <div className="contact_card_icon">
                                                        <i className="bi bi-envelope-fill"></i>
                                                    </div>
                                                    <h4 className="contact_card_head">
                                                        Email us
                                                    </h4>
                                                    <div className="contact_card_link_group">
                                                        <Link to={`mailto:koverdrivelondonon@gmail.com`}>
                                                            koverdrivelondonon@gmail.com
                                                        </Link>
                                                    </div>
                                                </article>
                                            </Zoom>
                                        </div>
                                    </div>

                                    <div className="section_content_sub">
                                        <div className="row">
                                            <div className="col-12">
                                                <Fade triggerOnce delay={100} className="h-100">
                                                    <article className="contact_form_card">
                                                        <div className="row">
                                                            <div className="col-12 col-lg-6 pe-lg-0">
                                                                <iframe
                                                                    title="Kover Drive"
                                                                    className="map_container"
                                                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2917.63706236852!2d-81.2173319!3d43.0069763!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882eed9ebad477ad%3A0x89bf171e2ad32cf9!2s1295%20Oxford%20St%20E%2C%20London%2C%20ON%20N5Y%204W4%2C%20Canada!5e0!3m2!1sen!2slk!4v1739603582874!5m2!1sen!2slk"
                                                                    allowFullScreen
                                                                    loading="lazy"
                                                                    referrerPolicy="no-referrer-when-downgrade"
                                                                ></iframe>
                                                            </div>
                                                            <div className="col-12 col-lg-6 ps-lg-0">

                                                                <form className="contact_form" onSubmit={handleSubmitContactForm}>
                                                                    <div className="row">
                                                                        <div className="col-12">
                                                                            <h4 className="contact_form_head">Reach us</h4>
                                                                        </div>

                                                                        <div className="col-12 col-sm-6">
                                                                            <TextInput
                                                                                id="name"
                                                                                label="Name"
                                                                                labelHtmlFor="name"
                                                                                required={true}
                                                                                inputType="text"
                                                                                value={name}
                                                                                placeholder="Your name"
                                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                                                                error={nameError}
                                                                                name="name"
                                                                            />
                                                                        </div>

                                                                        <div className="col-12 col-sm-6">
                                                                            <TextInput
                                                                                id="email"
                                                                                label="Email"
                                                                                labelHtmlFor="email"
                                                                                required={true}
                                                                                inputType="email"
                                                                                value={email}
                                                                                placeholder="Your email"
                                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                                                                error={emailError}
                                                                                name="email"
                                                                            />
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <TextInput
                                                                                id="subject"
                                                                                label="Subject"
                                                                                labelHtmlFor="subject"
                                                                                required={true}
                                                                                inputType="text"
                                                                                value={subject}
                                                                                placeholder="Subject"
                                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                                                                                error={subjectError}
                                                                                name="subject"
                                                                            />
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <TextArea
                                                                                id="message"
                                                                                label="Message"
                                                                                labelHtmlFor="message"
                                                                                required={true}
                                                                                value={message}
                                                                                placeholder="Your message"
                                                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                                                                                error={messageError}
                                                                            />
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <Button
                                                                                loading={loading}
                                                                                type="submit"
                                                                                label="Submit"
                                                                                className="custom_btn primary"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </article>
                                                </Fade>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*  */}
        </>
    );
};

export default Home;
