'use client';
import React, { useState } from 'react';
import { CITY_DATA } from '../lib/apilist';
import Link from 'next/link';
import useMounted from '../hooks/useMounted';

const Header = () => {
  const NavLinks = [
    { name: 'News', link: '/playlist/news' },
    { name: 'City News', link: '/playlist/city-news' },
    { name: 'Entertainment', link: '/playlist/entertainment' },
    { name: 'Social Viral', link: '/playlist/social-viral' },
    { name: 'Sakhi', link: '/playlist/sakhi' },
    { name: 'Bhakti', link: '/playlist/bhakti' },
    { name: 'Events', link: '/playlist/events' },
    { name: 'Inspirational', link: '/playlist/inspirational' },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const { mounted, isMobile } = useMounted();

  return (
    <header id="headerwrapper">
      <div className="headstrip">
        <div className="headerleft">
          <a className={`btnheadMenu ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </a>

          <Link href="/" className="brandlogo">
            <img
              src="https://d3pc1xvrcw35tl.cloudfront.net/assets/images/dm-video-tiles/lokmattv-logo-v0.0.png"
              alt="Lokmat TV"
              className="logoimage"
            />
          </Link>
        </div>

        <div className="headerright">
          <Link className="backtolokmat" href="/">
            <i className="spriticon iconback" />
            <span>
              Back to <span>Lokmat</span>.com
            </span>
          </Link>

          {isMobile && (
            <div className="citywrapper">
              <div
                className="btnselectcity"
                id="desktopcity"
                onClick={() => setIsCityOpen(!isCityOpen)}
              >
                Select City
                <i className={`spriticon iconcity ${isCityOpen ? 'up' : ''}`} />
              </div>

              <div className="cityWrap" style={{ display: isCityOpen ? 'block' : 'none' }}>
                <ul className="cityList">
                  {CITY_DATA.map((city, key) => (
                    <li className="cityItem " key={key}>
                      <Link
                        href={`/videos/${city.slug}/${city.playlist}`}
                        className=""
                        title={city.name}
                        onClick={() => setIsCityOpen(false)}
                      >
                        {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="navwrapper">
        <ul className="navList">
          <li className="navitem iconhome">
            <Link href="/">
              <i className="spriticon"></i>
            </Link>
          </li>
          {NavLinks.map((link, key) => (
            <li className="navitem " key={key}>
              <Link href={link.link}>{link.name}</Link>
            </li>
          ))}
        </ul>
        {/* add city wrapper here */}
        {!isMobile && (
          <div className="citywrapper">
            <div
              className="btnselectcity"
              id="desktopcity"
              onClick={() => setIsCityOpen(!isCityOpen)}
            >
              Select City
              <i className={`spriticon iconcity ${isCityOpen ? 'up' : ''}`} />
            </div>

            <div className="cityWrap" style={{ display: isCityOpen ? 'block' : 'none' }}>
              <ul className="cityList">
                {CITY_DATA.map((city, key) => (
                  <li className="cityItem " key={key}>
                    <Link
                      href={`/videos/${city.slug}/${city.playlist}`}
                      className=""
                      title={city.name}
                      onClick={() => setIsCityOpen(false)}
                    >
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>

      <div className="drawerwrapper" style={{ display: isOpen ? 'block' : 'none' }}>
        <div className="drawertop">
          <Link className="backtolokmat" href="/">
            <i className="spriticon iconback" />
            <span>
              Back to <span>Lokmat</span>.com
            </span>
          </Link>
        </div>
        <ul className="navList">
          {NavLinks.map((link, key) => (
            <li className="navitem " key={key} onClick={() => setIsOpen(false)}>
              <Link href={link.link}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
