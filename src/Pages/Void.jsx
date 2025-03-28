import React from 'react';
import VoidExperiments from '../components/VoidExperiments';
import Navbar from '../components/Navbar';
import '../style/void.css';

export default function Void() {
    return (
        <div className="void-page">
            <Navbar />
            <VoidExperiments />
        </div>
    );
} 