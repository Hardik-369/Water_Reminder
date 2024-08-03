import React, { useState, useEffect } from 'react';
import {AlertCircle, Droplet, Trophy, Quote, Clock } from 'lucide-react';

const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Strive not to be a success, but rather to be of value. - Albert Einstein"
];

const WaterReminderApp = () => {
  const [lastDrinkTime, setLastDrinkTime] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [countdown, setCountdown] = useState(3600);
  const [points, setPoints] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [customInterval, setCustomInterval] = useState(60);
  const [showCustomizeTimer, setShowCustomizeTimer] = useState(false);

  useEffect(() => {
    const checkWaterReminder = () => {
      if (countdown <= 0) {
        setShowNotification(true);
        setCountdown(customInterval * 60);
        setIsButtonDisabled(false);
      } else {
        setCountdown(prevCountdown => prevCountdown - 1);
      }
    };

    const interval = setInterval(checkWaterReminder, 1000);

    return () => clearInterval(interval);
  }, [countdown, customInterval]);

  useEffect(() => {
    if (showNotification) {
      new Notification("Time to drink water!", {
        body: "It's been " + customInterval + " minutes since your last drink. Stay hydrated!",
      });
    }
  }, [showNotification, customInterval]);

  useEffect(() => {
    const changeQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    };

    changeQuote();
    const interval = setInterval(changeQuote, 300000);

    return () => clearInterval(interval);
  }, []);

  const handleDrinkWater = () => {
    setLastDrinkTime(new Date().getTime());
    setShowNotification(false);
    setCountdown(customInterval * 60);
    setPoints(prevPoints => prevPoints + 100);
    setIsButtonDisabled(true);
  };

  const handleCustomIntervalChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setCustomInterval(value);
      setCountdown(value * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex flex-col">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600 flex items-center">
            <Droplet className="h-6 w-6 mr-2" />
            AquaRemind
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg">
            <h2 className="text-2xl flex items-center">
              <Droplet className="h-6 w-6 mr-2" />
              Water Drinking Reminder
            </h2>
            <p className="text-blue-100">Stay hydrated, stay healthy!</p>
          </div>
          <div className="p-4">
            {showNotification && (
              <div className="mb-4 bg-yellow-100 border-yellow-300 p-4 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-yellow-700 font-bold">Time to drink water!</h3>
                  <p className="text-yellow-600">
                    It's been {customInterval} minutes since your last drink. Stay hydrated!
                  </p>
                </div>
              </div>
            )}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600">{formatTime(countdown)}</div>
              <div className="text-sm text-gray-500">Time until next reminder</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${((customInterval * 60 - countdown) / (customInterval * 60)) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                Last drink: {lastDrinkTime ? new Date(lastDrinkTime).toLocaleTimeString() : 'Not yet recorded'}
              </p>
              <p className="font-bold text-lg flex items-center text-green-600">
                <Trophy className="h-5 w-5 mr-1" />
                {points} pts
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 italic flex items-start">
                <Quote className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                {currentQuote}
              </p>
            </div>
            <div className="mb-4">
              <button
                onClick={() => setShowCustomizeTimer(!showCustomizeTimer)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <Clock className="h-4 w-4 mr-1" />
                {showCustomizeTimer ? 'Hide' : 'Customize'} Timer
              </button>
              {showCustomizeTimer && (
                <div className="mt-2">
                  <label htmlFor="customInterval" className="block text-sm font-medium text-gray-700">
                    Reminder Interval (minutes):
                  </label>
                  <input
                    type="number"
                    id="customInterval"
                    value={customInterval}
                    onChange={handleCustomIntervalChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    min="1"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="p-4">
            <button 
              onClick={handleDrinkWater} 
              className={`w-full py-2 px-4 rounded-lg text-white font-bold ${
                isButtonDisabled 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 transition-colors'
              }`}
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? 'Wait for next reminder' : 'I drank water'}
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-white shadow-md mt-auto">
        <div className="container mx-auto py-4 px-4 text-center text-gray-600">
          Created by Hardik Kawale
        </div>
      </footer>
    </div>
  );
};

export default WaterReminderApp;