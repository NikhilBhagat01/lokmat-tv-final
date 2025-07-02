'use client';
import React, { useState } from 'react';
import { CITY_DATA } from '../lib/apilist';
import Link from 'next/link';
import useMounted from '../hooks/useMounted';

const Header = () => {
  const NavLinks = [
    { name: 'News', link: '/videos/news' },
    { name: 'City News', link: '/videos/city-news' },
    { name: 'Entertainment', link: '/videos/entertainment' },
    { name: 'Social Viral', link: '/videos/social-viral' },
    { name: 'Sakhi', link: '/videos/sakhi' },
    { name: 'Bhakti', link: '/videos/bhakti' },
    { name: 'Events', link: '/videos/events' },
    { name: 'Inspirational', link: '/videos/inspirational' },
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
          <a className="backtolokmat" href="https://www.lokmat.com">
            <i className="spriticon iconback" />
            <span>
              Back to <span>Lokmat</span>.com
            </span>
          </a>

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
          <a className="backtolokmat" href="https://www.lokmat.com">
            <i className="spriticon iconback" />
            <span>
              Back to <span>Lokmat</span>.com
            </span>
          </a>
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
