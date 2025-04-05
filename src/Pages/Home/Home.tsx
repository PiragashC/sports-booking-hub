import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Home.css';
import './Home-responsive.css';
import { Button } from "primereact/button";
import { Slide, Fade, Zoom } from "react-awesome-reveal";

import { goToTop } from "../../Components/GoToTop";
import { Features, features } from "./HomeData";
import TextInput from "../../Components/TextInput";
import TextArea from "../../Components/TextArea";
import apiRequest from "../../Utils/apiRequest";
import { emailRegex, removeEmptyValues, showErrorToast, showSuccessToast } from "../../Utils/commonLogic";
import { Toast } from "primereact/toast";
import { url } from "inspector";
import { ImageEditorNew } from "../../Components/ImageEditor/ImageEditor";
import { Edit } from "lucide-react";

interface WebContent {
    content_1: string;
    content_2: string;
    content_3: {
        id: number;
        c_1: string;
        c_2: string;
        c_3: string;
        c_4: string;
    }[];
    content_4: string;
    content_5: string;
    content_6: string;
    content_7: string;
    content_8: string;
    content_9: string;
    content_10: string;
    content_11: string;
    content_12: Features[];
}


const Home: React.FC = () => {
    const toastRef = useRef<Toast>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [featuresData, setFeaturesData] = useState<Features[]>([]);

    useEffect(() => {
        setFeaturesData(features);
    }, []);

    const handleNavigateBooking = () => {
        navigate(`/booking`);
        goToTop();
    }

    const intialReachUsForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
    }
    const [reachUsForm, setReachUsForm] = useState<typeof intialReachUsForm>(intialReachUsForm);
    const [isRequired, setIsRequired] = useState<boolean>(false);

    const [isEditMode, setIsEditMode] = useState<boolean>(true);
    const initialWebContents = {
        content_1: 'London’s Premier Indoor Cricket and Multi-Sport Facility!',
        content_2: 'Experience London’s ultimate indoor cricket and multi-sport destination! Train with top-quality lanes, pro-grade nets, and advanced pitching machines. With baseball and table tennis coming soon, the game never stops. Book your session today!',
        content_3: [{
            id: 1,
            c_1: 'Book Cricket Lane',
            c_2: 'Daily',
            c_3: '8 am – 10 pm',
            c_4: '$45/hr',
        }],
        content_4: '/web_assets/home/hero_img1.jpg',
        content_5: 'Elevating Indoor Sports in London, Ontario',
        content_6: 'Welcome to Kover Drive, the premier indoor cricket and baseball facility dedicated to fostering a love for the game while promoting fitness and skill development. Our mission is to create a vibrant community where players of all ages and skill levels can come together to enhance their abilities, build confidence, and enjoy the thrill of sports. At Kover Drive, we understand that every player has unique goals, whether you’re a beginner looking to learn the basics or an experienced athlete aiming to refine your technique. Our state of the-art facility is equipped with top-notch training equipment, batting cages, and practice areas designed to help you elevate your game.',
        content_7: 'Our facility provides a welcoming environment where you can work on your strength, agility, and endurance, ensuring you are at your best both on and off the field.',
        content_8: 'Join us at Kover Drive and become part of a community that celebrates the spirit of cricket and baseball. Whether you’re here to improve your game, meet new friends, or simply enjoy the sport, we are excited to support you on your journey. Together, let’s hit new heights in your athletic pursuits!',
        content_9: 'Contact Us today to learn more about our programs, schedule a visit, or book a session. We can’t wait to see you on the field!',
        content_10: '/web_assets/home/about_img.png',
        content_11: 'Discover What Makes Us the Ultimate Indoor Sports Destination',
        content_12: features
    }
    const [webContents, setWebContents] = useState<WebContent>(initialWebContents);
    const [openImageEditor, setOpenImageEditor] = useState<boolean>(false);
    const [contentKeyForImageEditor, setContentKeyForImageEditor] = useState<'content_4' | 'content_10'>();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReachUsForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmitContactForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRequired(false);
        if (!reachUsForm?.email || !emailRegex.test(reachUsForm.email) || !reachUsForm?.name || !reachUsForm?.message || !reachUsForm?.subject) {
            setIsRequired(true);
            return
        }
        setLoading(true);
        const response: any = await apiRequest({
            method: "post",
            url: "/booking/reach-us",
            data: removeEmptyValues(reachUsForm),
        });
        console.log(response);
        if (response && !response?.error) {
            showSuccessToast(toastRef, "Contact message sent successfully", "");
            setReachUsForm(intialReachUsForm);
        } else {
            showErrorToast(toastRef, "Failed to send contact message. Please try again.", response?.error);
        }
        setLoading(false);
    }


    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleContentChange = (event: React.FormEvent<HTMLHeadingElement | HTMLParagraphElement>) => {
        const target = event.target as HTMLElement;
        const contentKey = target.dataset.contentKey; // Get the key from data attribute

        if (contentKey) {
            setWebContents(prevContents => ({
                ...prevContents,
                [contentKey]: target.innerText // Update corresponding key
            }));
        }
    };

    const handleOnSaveForImageEditor = (file: File) => {
        if (contentKeyForImageEditor) {
            setWebContents(prevContents => ({
                ...prevContents,
                [contentKeyForImageEditor]: URL.createObjectURL(file)
            }));
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <Toast ref={toastRef} />
            {/* Hero section */}
            <section className={`home_hero_section page_init_section ${isScrolled && 'scrolled'}`} overflow-hidden id="home" style={{
                backgroundImage: `url(${webContents.content_4})`
            }}>
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <article className="home_hero_content">
                                <Slide direction="up" triggerOnce>
                                    <h1>
                                        Welcome to <span>Kover<span>Drive</span></span> Sports <Edit size={16} className="ms-2" onClick={(() => {
                                            setOpenImageEditor(true);
                                            setContentKeyForImageEditor('content_4');
                                        })} />
                                    </h1>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <h2 contentEditable={isEditMode}
                                        onBlur={handleContentChange}
                                        data-content-key="content_1">
                                        {webContents?.content_1}
                                    </h2>
                                </Slide>

                                <Slide direction="up" delay={200} triggerOnce>
                                    <p contentEditable={isEditMode}
                                        onBlur={handleContentChange}
                                        data-content-key="content_2">
                                        {webContents?.content_2}
                                    </p>
                                </Slide>

                                {/* <Zoom delay={200} duration={1500} triggerOnce className="w-100">
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
                                </Zoom> */}
                            </article>
                        </div>

                        <div className="col-12 col-xl-5 col-md-8 col-sm-8 mx-auto">
                            {webContents?.content_3 && Array.isArray(webContents?.content_3) && webContents.content_3.map((content: {
                                id: number;
                                c_1: string;
                                c_2: string;
                                c_3: string;
                                c_4: string;
                            }) => {
                                return (
                                    <Slide direction="up" triggerOnce delay={100} key={content.id}>
                                        <article className="home_hero_card">
                                            <div className="home_hero_card_header">
                                                <h4>{content?.c_1}</h4>
                                            </div>

                                            <div className="home_hero_card_body">
                                                <p><i className="bi bi-clock-fill me-1"></i> {content?.c_2}</p>
                                                <p>{content?.c_3}</p>
                                            </div>

                                            <div className="home_hero_card_footer">
                                                <h3>{content?.c_4}
                                                    <span> + Tax</span>
                                                </h3>
                                                <hr className="home_hero_card_footer_divider" />
                                                {/* <h3>$55/hr
                                                    <span> + Tax</span>&nbsp;
                                                    <small>(Book Bowling Machine (Lane 1))</small>
                                                </h3> */}
                                                <div className="home_hero_buttons">
                                                    <Button
                                                        label={content?.c_1}
                                                        className="custom_button primary"
                                                        onClick={handleNavigateBooking}
                                                    />
                                                </div>
                                            </div>
                                        </article>
                                    </Slide>
                                );
                            })}

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
                                    <h5 className="section_sub_title" contentEditable={isEditMode}
                                        onBlur={handleContentChange}
                                        data-content-key="content_5">
                                        {webContents?.content_5}
                                    </h5>
                                </Slide>

                                <div className="section_content">
                                    <Fade triggerOnce>
                                        <p className="section_desc" contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="content_6">
                                            {webContents?.content_6}
                                        </p>

                                        <p className="section_desc" contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="content_7">
                                            {webContents?.content_7}
                                        </p>

                                        <p className="section_desc" contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="content_8">
                                            {webContents?.content_8}
                                        </p>

                                        <p className="section_desc" contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="content_9">
                                            {webContents?.content_9}
                                        </p>
                                    </Fade>

                                    <Slide direction="up" delay={200} duration={1500} triggerOnce>
                                        <div className="home_hero_buttons justify-content-start">
                                            <Button
                                                icon={`ri ri-customer-service-fill`}
                                                label="Contact us"
                                                className="custom_button secondary custom"
                                                onClick={() => scrollToSection("contact")}
                                            />
                                        </div>
                                    </Slide>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6">
                            <Fade triggerOnce duration={1500} className="w-100">
                                <div className="section_image_area">
                                    <img src={webContents?.content_10} alt="" />
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
                                    <h5 className="section_sub_title text-center" contentEditable={isEditMode}
                                        onBlur={handleContentChange}
                                        data-content-key="content_11">
                                        {webContents?.content_11}
                                    </h5>
                                </Slide>

                                <div className="section_content">
                                    {webContents?.content_12 && Array.isArray(webContents?.content_12) && (
                                        <div className="row features_row">
                                            {webContents?.content_12?.map((feature, index) => (
                                                <div key={feature?.id} className="col-12 col-xl-4 col-md-6 col-sm-8 mx-auto features_col">
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
                                        <span>Get in touch</span> with us
                                    </h3>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <h5 className="section_sub_title text-center">
                                        We're Here to Help – Reach Out Today!
                                    </h5>
                                </Slide>

                                <div className="section_content">
                                    <div className="row contact_us_row">
                                        <div className="col-12 col-md-12 col-sm-8 mx-auto col-lg-4">
                                            <Zoom triggerOnce className="h-100">
                                                <article className="contact_us_card">
                                                    <div className="contact_card_icon">
                                                        <i className="bi bi-geo-alt-fill"></i>
                                                    </div>
                                                    <h4 className="contact_card_head">
                                                        Location
                                                    </h4>
                                                    <div className="contact_card_link_group">
                                                        <Link to={`https://maps.app.goo.gl/XtnfBT1nHxvnLZDZ7`} target="_blank">
                                                            1299 Oxford St E, London, ON N5Y 4W5, Canada
                                                        </Link>
                                                    </div>
                                                </article>
                                            </Zoom>
                                        </div>

                                        <div className="col-12 col-md-6 col-sm-8 mx-auto col-lg-4">
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

                                        <div className="col-12 col-md-6 col-sm-8 mx-auto col-lg-4">
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
                                                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2917.6494829276908!2d-81.2110879!3d43.006714800000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882eed006ba619d1%3A0xe9205b592e1f63be!2sKover%20Drive%20Sports!5e0!3m2!1sen!2slk!4v1739845810056!5m2!1sen!2slk"
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
                                                                                value={reachUsForm?.name}
                                                                                placeholder="Your name"
                                                                                onChange={handleInputChange}
                                                                                error={(isRequired && !reachUsForm.name) ? "Name is required!" : ""}
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
                                                                                value={reachUsForm.email}
                                                                                placeholder="Your email"
                                                                                onChange={handleInputChange}
                                                                                error={(isRequired && !reachUsForm.email) ? "Email is required!" : (!emailRegex.test(reachUsForm?.email) && reachUsForm?.email) ? "Please enter valid email!" : ""}
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
                                                                                value={reachUsForm.subject}
                                                                                placeholder="Subject"
                                                                                onChange={handleInputChange}
                                                                                error={(isRequired && !reachUsForm.subject) ? "Subject is required!" : ""}
                                                                                name="subject"
                                                                            />
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <TextArea
                                                                                id="message"
                                                                                label="Message"
                                                                                labelHtmlFor="message"
                                                                                required={true}
                                                                                value={reachUsForm.message}
                                                                                placeholder="Your message"
                                                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReachUsForm({ ...reachUsForm, message: e.target.value })}
                                                                                error={(isRequired && !reachUsForm.message) ? "Message is required!" : ""}

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

            
            <ImageEditorNew
                isOpen={openImageEditor}
                onClose={() => { setOpenImageEditor(false); setContentKeyForImageEditor(undefined); }}
                onSave={handleOnSaveForImageEditor}
                acceptedFileTypes={['.jpg', '.jpeg', '.png']}
                maxFileSize={5 * 1024 * 1024} // 5MB
            />
        </>
    );
};

export default Home;
