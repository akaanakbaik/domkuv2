import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { generateApiKey } from '../utils/generateApiKey';

const Sidebar = ({ show, setShow, user }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('username, api_key')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user ', error);
      return;
    }
    setUserData(data);
    if (data.api_key) setApiKey(data.api_key);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShow(false);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    alert('API Key disalin!');
  };

  const truncateName = (name) => name.length > 10 ? name.substring(0, 10) + '...' : name;

  return (
    <>
      {show && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShow(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-1/4 w-full md:w-1/2 lg:w-1/4 bg-dark-800 border-l border-dark-700 z-50 transform transition-transform duration-300 ease-in-out sidebar ${
          show ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShow(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <button
              onClick={() => { navigate('/'); setShow(false); }}
              className="block w-full text-left text-blue-400 hover:underline"
            >
              Home
            </button>
            <button
              onClick={() => { navigate('/subdomain'); setShow(false); }}
              className="block w-full text-left text-blue-400 hover:underline"
            >
              Subdomain
            </button>
            <button
              onClick={() => { navigate('/api'); setShow(false); }}
              className="block w-full text-left text-blue-400 hover:underline"
            >
              API
            </button>
            <button
              onClick={() => { navigate('/developer'); setShow(false); }}
              className="block w-full text-left text-blue-400 hover:underline"
            >
              Info Developer
            </button>
          </div>
          {user && userData && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => alert('Akun: ' + userData.username + '\nEmail: ' + user.email + '\nSubdomain dibuat: 0')}>
                <img
                  src={`https://robohash.org/${user.email}?size=32x32&set=set4`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{truncateName(userData.username)}</p>
                  {apiKey && (
                    <div className="flex items-center mt-1">
                      <input
                        type="text"
                        value={apiKey}
                        readOnly
                        className="bg-dark-700 text-xs px-2 py-1 rounded w-32 truncate"
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); copyApiKey(); }}
                        className="ml-1 text-blue-400 hover:text-blue-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
