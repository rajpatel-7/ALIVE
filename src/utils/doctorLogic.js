export const doctorLogic = {
    // Analyze the user's report and conversation to generate an AI response
    analyze: (transcript, result) => {
        const text = transcript.toLowerCase();

        // 1. GREETING / INTRO
        if (text.includes('hello') || text.includes('hi') || text.includes('help')) {
            return `Hello ${result.name}. I have analyzed your cardiovascular report. Your calculated risk is ${(result.risk_probability * 100).toFixed(1)}%. I am here to explain your results or offer advice. What would you like to know?`;
        }

        // 2. EXPLAIN RISK (Why?)
        if (text.includes('why') || text.includes('risk') || text.includes('score')) {
            let reasons = [];
            if (result.risk_probability > 0.5) reasons.push("Overall, your calculated risk is above normal.");
            if (result.ap_hi > 130) reasons.push(`Your systolic blood pressure is ${result.ap_hi}, which is considered elevated.`);
            if (result.cholesterol > 1) reasons.push("Your cholesterol levels are flagged as above normal.");
            if (result.smoke) reasons.push("Smoking is a significant contributor to your risk score.");
            if (result.bmi > 25) reasons.push("Your BMI suggests you are overweight, which adds strain to your heart.");

            if (reasons.length === 0) return "Your risk is quite low! You are doing a great job maintaining your health. Keep up the active lifestyle.";
            return "Based on your data: " + reasons.join(" ");
        }

        // 3. DIET / FOOD
        if (text.includes('eat') || text.includes('diet') || text.includes('food')) {
            if (result.cholesterol > 1 || result.gluc > 1) {
                return "Since your biomarkers for cholesterol or glucose are elevated, I recommend a diet low in saturated fats and added sugars. Focus on leafy greens, whole grains, and lean proteins.";
            }
            return "A balanced diet is key. Maintain a colorful plate with plenty of vegetables, fruits, and heart-healthy fats like olive oil and avocados.";
        }

        // 4. EXERCISE / ACTIVITY
        if (text.includes('exercise') || text.includes('run') || text.includes('active')) {
            if (result.active) return "You are already active, which is fantastic! Aim for 150 minutes of moderate activity per week to maintain this protection.";
            return "I noticed you listed yourself as inactive. Starting small, like a 30-minute daily walk, can reduce your heart disease risk by up to 20%.";
        }

        // 5. SMOKING / ALCOHOL
        if (text.includes('smoke') || text.includes('smoking') || text.includes('alcohol') || text.includes('drink')) {
            if (result.smoke) return "Smoking is the single biggest modifyable risk factor. Quitting today can immediately lower your blood pressure and heart rate.";
            if (result.alco) return "Alcohol should be consumed in moderation. Excessive intake can raise blood pressure.";
            return "You reported no smoking or alcohol issues, which is excellent for your long-term heart health.";
        }

        // DEFAULT / FALLBACK
        return "I didn't quite catch that context. You can ask me about your 'Risk Factors', 'Diet Recommendations', or 'Exercise Advice'.";
    }
};
