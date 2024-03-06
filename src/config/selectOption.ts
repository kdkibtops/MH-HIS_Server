export const selectOptionsValues = {
	modality: {
		CT: 'CT',
		xray: 'CR',
		ultrasound: 'US',
		intervention: 'XA',
		MRI: 'MR',
	},
	gender: { male: 'Male', feamle: 'Female' },
	job: {
		HOD: 'HOD',
		radiologist: 'Radiologist',
		technician: 'Technician',
		secretary: 'Secretary',
		patient: 'Patient',
	},
	user_role: { admin: 1, radiologist: 2, user: 3 },
	o_status: {
		schedueled: 'Schedueled',
		completed: 'Completed',
		reported: 'Reported',
	},
	report_status: {
		pending: 'Pending',
		completed: 'Completed',
		verified: 'Verified',
		printed: 'Printed',
		delivered: 'Delivered',
	},
	critical: { ciritical: 'critical', notCritical: 'not' },
};
