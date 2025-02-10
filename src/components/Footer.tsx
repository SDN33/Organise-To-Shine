import React from 'react';

interface FooterLink {
  id: string;
  text: string;
  url: string;
  target?: string;
}

interface Props {
  customLinks?: FooterLink[];
  hideEdition?: boolean;
}

export const Footer: React.FC<Props> = () => {
  return (
    <footer className="bg-indigo-700 text-white">
      {/* Section Contenu Principal */}
      <div className="py-12 mx-auto px-4 justify-center flex border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-7xl">
          {/* Logo et Description */}
          <div className="text-center md:text-left">
            <div className="mb-6">
              <a href="#" className="inline-block">
                <img
                  src="https://res.cloudinary.com/daroyxenr/image/upload/v1739149742/07a8a9c192544fe28acd5ee09fc6c6ca-free_rwcrr6.png"
                  className="h-40 w-auto mx-auto md:mx-0"
                  alt="logo"
                />
              </a>
            </div>
            <p className="text-white text-lg mb-6">
              L'info digitale qui fait vibrer votre quotidien !
            </p>
            <div>
              <span className="block text-lg font-semibold mb-4"> Suivez-nous:</span>
              <div className="flex space-x-4 justify-center md:justify-start">
                <a href="#" className="text-blue-400 hover:text-blue-300"><i className="fab fa-facebook-f text-xl"></i></a>
                <a href="#" className="text-blue-400 hover:text-blue-300"><i className="fab fa-twitter text-xl"></i></a>
                <a href="#" className="text-blue-400 hover:text-blue-300"><i className="fab fa-google-plus-g text-xl"></i></a>
              </div>
            </div>
          </div>

          {/* Section Subscribe */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Abonnez-vous et ne manquez aucuns de nos derniers articles du monde digital
            </p>
            <form className="flex max-w-md mx-auto md:mx-0">
              <input
                type="text"
                placeholder="Email ..."
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l focus:outline-none focus:border-blue-400"
              />
              <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-r transition-colors">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"></link>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between py-6 items-center">
            <div className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              <p>Propulsé par <a className='text-white' href="https://stillinov.com">Still-inov Agency</a> Copyright &copy; 2025, Tous droits réservés.</p>
            </div>
            <div>
              <ul className="flex flex-wrap justify-center space-x-4 md:space-x-6 px-4">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';
