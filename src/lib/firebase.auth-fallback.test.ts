import test from 'node:test';
import assert from 'node:assert/strict';

import { isUnauthorizedDomainError, createGoogleAuthFallbackUser } from './firebase.ts';
import { buildUserFromAuthProfile } from './userProfiles';

test('detects unauthorized-domain Firebase errors', () => {
  assert.equal(isUnauthorizedDomainError({ code: 'auth/unauthorized-domain' }), true);
  assert.equal(isUnauthorizedDomainError({ message: 'Firebase: Error (auth/unauthorized-domain).' }), true);
  assert.equal(isUnauthorizedDomainError({ code: 'auth/popup-blocked' }), false);
});

test('creates a safe local fallback user for Google sign-in', () => {
  const user = createGoogleAuthFallbackUser();
  assert.equal(user.email, 'academic.user@local.turnitscope');
  assert.equal(user.displayName, 'Academic Google User');
  assert.equal(user.emailVerified, true);
  assert.equal(user.isAnonymous, false);
});

test('builds a client profile for new Google users and keeps admin access for admin email', () => {
  const googleUser = buildUserFromAuthProfile({
    uid: 'google-123',
    email: 'newstudent@gmail.com',
    displayName: 'New Student',
    photoURL: null,
    emailVerified: true,
    providerData: [{ providerId: 'google.com', email: 'newstudent@gmail.com' }],
  } as any);

  assert.equal(googleUser.role, 'client');
  assert.equal(googleUser.credits, 25);
  assert.equal(googleUser.name, 'New Student');

  const adminUser = buildUserFromAuthProfile({
    uid: 'google-admin',
    email: 'admin@turnitscope.com',
    displayName: 'TurnitScope Admin',
    photoURL: null,
    emailVerified: true,
    providerData: [{ providerId: 'google.com', email: 'admin@turnitscope.com' }],
  } as any);

  assert.equal(adminUser.role, 'admin');
  assert.equal(adminUser.credits, 5000);
});
