import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, TreePine, RefreshCw } from 'lucide-react';

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Failure Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white text-center">
            <XCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
            <p className="text-red-100">Your transaction could not be completed</p>
          </div>

          {/* Failure Details */}
          <div className="p-8 text-center">
            <div className="mb-8">
              <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Don't worry, your trees are still waiting!
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your payment was not processed successfully. This could be due to various reasons such as 
                insufficient funds, network issues, or payment gateway problems.
              </p>
            </div>

            {/* Common Reasons */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Common reasons for payment failure:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Insufficient balance in your eSewa account
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Network connectivity issues
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Incorrect payment credentials
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Payment gateway timeout
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/donate"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-xl font-semibold transition-colors text-center"
              >
                Go to Dashboard
              </Link>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-4">
                Need help? Contact our support team for assistance.
              </p>
              <Link
                to="/contact"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;