const ImageAnalysisService = require('../services/imageAnalysis.service');
const RecommendationService = require('../services/recommendation.service');
const path = require('path');
const fs = require('fs');
const os = require('os');

const analyzeClaimImage = async (req, res) => {
    try {
        const { imageData, claimId, claimType } = req.body;

        // Save base64 image to temp file
        const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
        const tempDir = path.join(os.tmpdir(), 'claim-images');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        const tempFilePath = path.join(tempDir, `claim_${claimId}_${Date.now()}.jpg`);
        fs.writeFileSync(tempFilePath, imageBuffer);

        // Analyze image
        const analysisResult = await ImageAnalysisService.analyzeImage(tempFilePath);

        // Get recommendations
        const similarCases = await RecommendationService.findSimilarCases(analysisResult.description || '');
        const recommendedCommercial = await RecommendationService.recommendCommercial(claimType);
        const preventiveActions = await RecommendationService.suggestPreventiveActions(claimType);

        // Clean up temp file
        fs.unlinkSync(tempFilePath);

        res.json({
            success: true,
            analysis: analysisResult,
            recommendations: {
                similarCases,
                recommendedCommercial,
                preventiveActions
            }
        });
    } catch (error) {
        console.error('Error analyzing claim image:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    analyzeClaimImage
};
