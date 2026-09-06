import api from './api';

export const studentService = {
  // Get full profile + completion
  getProfile: async () => {
    const response = await api.get('/students/me');
    return response.data;
  },

  // Update basic profile info (phone, location, bio)
  updateProfile: async (profileData) => {
    const response = await api.put('/students/me', profileData);
    return response.data;
  },

  // Get skills
  getSkills: async () => {
    const response = await api.get('/students/me/skills');
    return response.data;
  },

  // Update skills (technical & soft skills)
  updateSkills: async (skillsData) => {
    const response = await api.put('/students/me/skills', skillsData);
    return response.data;
  },

  // Get education
  getEducation: async () => {
    const response = await api.get('/students/me/education');
    return response.data;
  },

  // Add education record
  addEducation: async (eduData) => {
    const response = await api.post('/students/me/education', eduData);
    return response.data;
  },

  // Update education record
  updateEducation: async (eduId, eduData) => {
    const response = await api.put(`/students/me/education/${eduId}`, eduData);
    return response.data;
  },

  // Delete education record
  deleteEducation: async (eduId) => {
    const response = await api.delete(`/students/me/education/${eduId}`);
    return response.data;
  },

  // Get career interests
  getCareerInterests: async () => {
    const response = await api.get('/students/me/interests');
    return response.data;
  },

  // Update career interests
  updateCareerInterests: async (interests) => {
    const response = await api.put('/students/me/interests', { careerInterests: interests });
    return response.data;
  },

  // Get taxonomy metadata
  getTaxonomy: async () => {
    const response = await api.get('/students/taxonomy');
    return response.data;
  },
};

export default studentService;
