import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import r1 from "../assets/r1.jpg";
import r2 from "../assets/r2.jpg";
import r3 from "../assets/r3.jpg";

export default function LandingPage() {
  const { hash } = useLocation();
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); }, [hash]);
  return <div className="landing-page">
    <Navbar />
    <main>
      <section className="dining-hero" id="home">
        <div className="dining-hero-copy">
          <span className="eyebrow"><span className="status-dot" /> A PLACE AT THE TABLE</span>
          <h1>Good food.<br />Great company.<br /><em>Your table awaits.</em></h1>
          <p>Slow down, settle in, and share something delicious. Make room for your next favourite moment.</p>
          <div className="dining-actions"><Link className="button-primary" to="/book-table">Find your table <span>↗</span></Link><Link className="button-text" to="/menu">Explore the menu →</Link></div>
          <div className="hero-note"><span>01 /</span> Choose a table. Pick your favourites. Enjoy.</div>
        </div>
        <div className="dining-hero-visual"><img src={r1} alt="A slice of freshly baked pepperoni pizza with melted cheese" fetchPriority="high" /><div className="image-caption"><span>MADE FOR MOMENTS TOGETHER</span><strong>A little taste of the good life.</strong></div><span className="image-stamp">Fresh flavours.<br />Warm welcomes.</span></div>
      </section>
      <div className="dining-strip"><span>Freshly prepared</span><i>✳</i><span>Indoor & outdoor dining</span><i>✳</i><span>A seat for every occasion</span></div>
      <section className="dining-section" id="menu">
        <div className="section-heading"><div><span className="eyebrow">SOMETHING TO LOOK FORWARD TO</span><h2>Come hungry. Leave happy.</h2></div><Link className="button-text" to="/menu">View our menu ↗</Link></div>
        <div className="dining-cards">{[
          {img:r2, title:"Find your new favourite", text:"Discover the dishes on our menu.", tag:"THE MENU", to:"/menu"},
          {img:r3, title:"Make it an occasion", text:"Bring your people. We'll save you a seat.", tag:"YOUR NEXT GATHERING", to:"/book-table"},
          {img:r1, title:"A table, your way", text:"A cosy spot inside or a little fresh air outside.", tag:"THE EXPERIENCE", to:"/book-table"},
        ].map((item,i) => <Link className="dining-card" key={item.title} to={item.to}><div className="dining-card-image"><img src={item.img} alt={item.title} loading="lazy" /><span>0{i+1}</span></div><span className="eyebrow">{item.tag}</span><h3>{item.title} <span>↗</span></h3><p>{item.text}</p></Link>)}</div>
      </section>
      <section className="dining-story" id="about"><span className="eyebrow">THE SIMPLE THINGS, DONE WELL</span><h2>A good meal is better<br />when it's shared.</h2><p>Family catch-ups, easy lunches, and evenings that turn into memories. At VC Restaurant, there's always room for good food and good company.</p><Link className="button-primary" to="/book-table">Let's make a reservation ↗</Link></section>
    </main>
    <footer className="dining-footer" id="contact"><Link className="footer-brand" to="/">vc.<span>Pull up a chair.</span></Link><div><Link to="/menu">Our menu</Link><Link to="/book-table">Reservations</Link><Link to="/login">Staff sign in</Link></div><p>© {new Date().getFullYear()} VC Restaurant</p></footer>
  </div>;
}