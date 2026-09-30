Parking Rotation System (PRS)

Phase 1: User management

    - User: Registration
    	- Accepts first name, last name, email, user name, password (all required)
    - Admin: User management
    	- Approve user
    		- Set status to PENDING once approved, and role to USER
    	- Edit user
    		- Allow edit
    	- Seed admin credential: parkingadmin / admin123
    	- Get user list
    		- Add ‘createdAt’, ‘updatedAt’ and other data from user
    		- Search via name, username and email
    - User: Login
    	- Accepts username and password
    - Get logged in user details (/api/auth/me)

Phase 2: Setup vehicle information

    - User/Admin: Add vehicle
    	- Make (optional)
    	- Model (optional)
    	- Color (optional)
    	- Plate number
    	- No car days (Monday to Friday) - optional / multiple
    - User/Admin: Vehicle
    	- Edit vehicle (All fields)
    	- Delete vehicle
    		- Remove all reservation after deletion
    - User/Admin: Parking management
    	- Add parking slot
    		- Slot number
    		- Location
    		- Owner
    	- Edit parking slot
    		- Slot number
    		- Location
    	- Deactivate parking slot
    	- Delete parking slot

Phase 3: Scheduling

    - Generate schedule
    	- Follow src/lib/scheduler.ts

    - User: Slot assigned
    	- Request swap to other user
    	- Skip assigned slot
    		- Will not be reassigned to another schedule

    - Admin: Request management
    	- Approve swap
    	- Decline swap request
    		- Provide reason

Phase 4: Notification and activity log

    - User: Notification
    	- User swap approval
    	- User decline swap
    	- Slot assigned (month schedule)

    - Admin: Activity log
    	- Date
    	- Initiated by
    	- Event
    	- Affected user
