"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Register.module.scss'; // SCSS import kiya

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    reTypePassword: '',
    contact: '',
    gender: 'Male',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.reTypePassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Account Created Successfully!");
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.card}>
        <h1>Create Account</h1>
        <p>Get started with Vera AI today</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required={true} suppressHydrationWarning={true} />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required={true} suppressHydrationWarning={true} />
          </div>

          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          <input type="text" name="contact" placeholder="Contact Number" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Create Password" onChange={handleChange} required />
          <input type="password" name="reTypePassword" placeholder="Re-type Password" onChange={handleChange} required />

          <select name="gender" onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button type="submit" className={styles.submitBtn}>Sign Up</button>
        </form>

        <p className={styles.footerLink}>
          Already have an account? <Link href="/sign-in">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;