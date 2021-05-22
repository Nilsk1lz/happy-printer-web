import React, { Component } from 'react';
import { Image } from 'react-bootstrap';

class Home extends Component {
  render() {
    return (
      <div className='Register'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <Image
                style={{ height: '500px', width: '100%', objectFit: 'cover' }}
                src='/assets/images/paperang.jpg'
                fluid
              />
            </div>
            <div className='col-md-6 align-self-center'>
              <div className='col-md-12 hero '>
                <h3>What is it?</h3>
                <p>
                  In 2012, a company called BERG launched their Little Printer. A few years later the company disapeared
                  and it's servers were taken down, leaving little printers across the land stranded and un-usable. The
                  Happy Printer project seeks to recreate the fun and excitment of printing your own newsfeed, on
                  demand.
                </p>
                <p>
                  Using readily available hardware, we've created an online service to gather together your favourite
                  news, puzzles and gossip from friends. Subscribe to the services you want, and each day (or whenever
                  you wish) we'll produce your own, customised mini-newspaper.
                </p>
              </div>
            </div>
          </div>
          <div className='row' style={{ width: '100%' }}>
            <div
              className='col-md-12'
              style={{
                backgroundImage: 'url(/assets/images/Path.png)',
                top: '-10px',
                height: '20px',
              }}></div>
          </div>
          <div className='row px-5' style={{ width: '100%' }}>
            <div className='col-md-12 mt-3' style={{ textAlign: 'center' }}>
              <h3>What do you need?</h3>
              <p>
                You'll need two things to get started. Firstly you'll need a supported thermal printer (see list of
                supported printers). Secondly you'll need a raspberry pi, or similar, running our custom version of
                Linux Debian. The image for your SD card can be downloaded here: Or alternatively you can buy all you
                need (including pre-flashed SD cards) at our online shop.
              </p>
              <h4 className='mt-5' style={{ textAlign: 'left' }}>
                We currently support the following printers:
              </h4>
              <ul style={{ textAlign: 'left' }}>
                <li>Paperang P1</li>
                <li>Paperang P2</li>
                <li>Paperang P2S</li>
              </ul>

              <p></p>
            </div>
          </div>
          <div className='row mt-5' style={{ width: '100%' }}>
            <div
              className='col-md-12'
              style={{
                backgroundImage: 'url(/assets/images/Path.png)',
                top: '-10px',
                height: '20px',
              }}></div>
          </div>
          <div className='row px-5' style={{ width: '100%' }}>
            <div className='col-md-12 mt-3' style={{ textAlign: 'center' }}>
              <h3>What's it cost?</h3>
              <p>
                You can download our bridge image for free, this will allow you to connect to your printer and print
                messages and use the instant messaging feature.
              </p>
              <p>
                If you wish to subscribe to our publications we ask that you support this project via Patreon. This
                allows us to pay for the upkeep of our servers and develop new and exciting publications. Registering
                for Patreon costs $4 per month.
              </p>
              <p>
                Explore our publications{' '}
                <a style={{ color: 'blue' }} href='/publications'>
                  here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
