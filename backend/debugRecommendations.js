// debugRecommendations.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Internship, Application } from "./student/models/Internship.js";
import Student from "./student/models/Student.js";

dotenv.config();

async function debugRecommendations(studentEmail) {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB\n");

        // Check Student
        console.log("=".repeat(50));
        console.log("STEP 1: Checking Student Data");
        console.log("=".repeat(50));

        const student = await Student.findOne({ email: studentEmail });
        if (!student) {
            console.log("Student not found!");
            process.exit(1);
        }

        console.log("Student found:");
        console.log(`   Name: ${student.fullName}`);
        console.log(`   Email: ${student.email}`);
        console.log(`   CV Uploaded: ${student.cvUrl ? 'Yes' : 'No'}`);
        console.log(`   Skills Extracted: ${student.extractedSkills?.length || 0}`);
        console.log(`   Skills: ${student.extractedSkills?.join(', ') || 'None'}\n`);

        // Check Internships
        console.log("=".repeat(50));
        console.log("STEP 2: Checking Available Internships");
        console.log("=".repeat(50));

        const internships = await Internship.find({ isActive: true });
        console.log(`Found ${internships.length} active internships\n`);

        internships.forEach((int, idx) => {
            console.log(`${idx + 1}. ${int.title} - ${int.company}`);
            console.log(`   Required Skills: ${int.requiredSkills.join(', ')}`);
        });

        // Step 3: Check Applications
        console.log("\n" + "=".repeat(50));
        console.log("STEP 3: Checking Applied Internships");
        console.log("=".repeat(50));

        const applications = await Application.find({ studentId: student._id });
        console.log(`Student has ${applications.length} applications\n`);

        const appliedIds = applications.map(a => a.internshipId.toString());
        console.log(`Applied Internship IDs: ${appliedIds.join(', ') || 'None'}\n`);

        // Calculate Matches
        console.log("=".repeat(50));
        console.log("STEP 4: Calculating Match Scores");
        console.log("=".repeat(50));

        const studentSkills = (student.extractedSkills || []).map(s => s.toLowerCase().trim());
        console.log(`Student Skills (normalized): ${studentSkills.join(', ')}\n`);

        const availableInternships = internships.filter(
            int => !appliedIds.includes(int._id.toString())
        );

        console.log(`Available (not applied) Internships: ${availableInternships.length}\n`);

        const matches = [];

        availableInternships.forEach(internship => {
            const requiredSkills = (internship.requiredSkills || [])
                .map(s => s.toLowerCase().trim());

            const matchingSkills = requiredSkills.filter(reqSkill =>
                studentSkills.some(stuSkill =>
                    stuSkill === reqSkill ||
                    stuSkill.includes(reqSkill) ||
                    reqSkill.includes(stuSkill)
                )
            );

            const matchScore = requiredSkills.length > 0
                ? Math.round((matchingSkills.length / requiredSkills.length) * 100)
                : 0;

            if (matchScore > 0) {
                matches.push({
                    title: internship.title,
                    company: internship.company,
                    matchScore,
                    matchingSkills: matchingSkills.length,
                    totalRequired: requiredSkills.length
                });
            }

            console.log(`\n ${internship.title}`);
            console.log(`   Required: ${requiredSkills.join(', ')}`);
            console.log(`   Matched: ${matchingSkills.join(', ') || 'None'}`);
            console.log(`   Match Score: ${matchScore}%`);
        });

        // Step 5: Summary
        console.log("\n" + "=".repeat(50));
        console.log("STEP 5: Recommendations Summary");
        console.log("=".repeat(50));

        if (matches.length === 0) {
            console.log(" No matching internships found!");
            console.log("\n💡 Possible reasons:");
            console.log("   1. Student skills don't match any internship requirements");
            console.log("   2. All matching internships already applied");
            console.log("   3. No active internships in database");
        } else {
            console.log(`Found ${matches.length} matching internships:\n`);
            matches
                .sort((a, b) => b.matchScore - a.matchScore)
                .forEach((match, idx) => {
                    console.log(`${idx + 1}. ${match.title} - ${match.company}`);
                    console.log(`   Match Score: ${match.matchScore}%`);
                    console.log(`   Matching Skills: ${match.matchingSkills}/${match.totalRequired}`);
                });
        }

        await mongoose.connection.close();
        console.log("\n Debug complete!");

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

const email = process.argv[2];
if (!email) {
    console.log("Please provide student email:");
    console.log("   node debugRecommendations.js your-email@students.riphah.edu.pk");
    process.exit(1);
}

debugRecommendations(email);