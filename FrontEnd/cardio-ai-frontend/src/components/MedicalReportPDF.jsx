import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register a standard font (optional, using default Helvetica is fine for speed)
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        color: '#334155'
    },
    header: {
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#4f46e5',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4f46e5'
    },
    headerDetails: {
        fontSize: 10,
        textAlign: 'right',
        color: '#64748b'
    },
    section: {
        marginBottom: 20,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1e293b',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 5
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: 120,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748b'
    },
    value: {
        fontSize: 10,
        color: '#1e293b'
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10
    },
    gridItem: {
        width: '33%',
        marginBottom: 10
    },
    resultBox: {
        marginTop: 10,
        padding: 20,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 5
    },
    scoreMajor: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 5
    },
    scoreLabel: {
        fontSize: 12,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 8,
        textAlign: 'center',
        color: '#94a3b8',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10
    },
    disclaimer: {
        marginTop: 5,
        fontSize: 8,
        fontStyle: 'italic',
        color: '#94a3b8'
    }
});

const MedicalReportPDF = ({ data }) => {
    const isHighRisk = data.risk_probability > 0.5;
    const riskColor = isHighRisk ? '#e11d48' : '#059669'; // Rose-600 vs Emerald-600

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.logoText}>ALIVE AI</Text>
                        <Text style={{ fontSize: 8, color: '#94a3b8' }}>Advanced Diagnostic Algorithm</Text>
                    </View>
                    <View>
                        <Text style={styles.headerDetails}>Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</Text>
                        <Text style={styles.headerDetails}>Date: {data.date}</Text>
                        <Text style={styles.headerDetails}>Time: {new Date(data.timestamp).toLocaleTimeString()}</Text>
                    </View>
                </View>

                {/* Patient Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PATIENT INFORMATION</Text>
                    <View style={styles.grid}>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Name</Text>
                            <Text style={styles.value}>{data.name}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Age</Text>
                            <Text style={styles.value}>{data.age} Years</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Gender</Text>
                            <Text style={styles.value}>Not Specified</Text>
                        </View>
                    </View>
                </View>

                {/* Clinical Data */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>CLINICAL METRICS</Text>
                    <View style={styles.grid}>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Height</Text>
                            <Text style={styles.value}>{data.height} cm</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Weight</Text>
                            <Text style={styles.value}>{data.weight} kg</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Other</Text>
                            <Text style={styles.value}>--</Text>
                        </View>

                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Blood Pressure</Text>
                            <Text style={styles.value}>{data.ap_hi} / {data.ap_lo} mmHg</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Cholesterol</Text>
                            <Text style={styles.value}>Level {data.cholesterol}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Glucose</Text>
                            <Text style={styles.value}>Level {data.gluc}</Text>
                        </View>

                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Smoking</Text>
                            <Text style={styles.value}>{data.smoke ? "Yes" : "No"}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Alcohol</Text>
                            <Text style={styles.value}>{data.alco ? "Yes" : "No"}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Physical Activity</Text>
                            <Text style={styles.value}>{data.active ? "Active" : "Sedentary"}</Text>
                        </View>
                    </View>
                </View>

                {/* Analysis Result */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ALGORITHMIC ANALYSIS</Text>

                    <View style={[styles.resultBox, { borderLeftWidth: 4, borderLeftColor: riskColor }]}>
                        <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 5, textAlign: 'center' }}>CARDIOVASCULAR RISK PROBABILITY</Text>
                        <Text style={[styles.scoreMajor, { color: riskColor }]}>{(data.risk_probability * 100).toFixed(1)}%</Text>
                        <Text style={[styles.scoreLabel, { color: riskColor }]}>{data.risk_category}</Text>
                    </View>

                    <Text style={{ fontSize: 10, marginTop: 15, lineHeight: 1.5 }}>
                        {data.note}
                    </Text>
                </View>

                {/* Recommendations */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>CLINICAL RECOMMENDATIONS</Text>
                    {data.advice && data.advice.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', marginBottom: 8 }}>
                            <Text style={{ width: 15, fontSize: 10, color: '#4f46e5' }}>•</Text>
                            <Text style={{ fontSize: 10, flex: 1 }}>{item}</Text>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Generated by ALIVE AI System v4.0</Text>
                    <Text style={styles.disclaimer}>
                        This report is generated by an artificial intelligence model and is intended for screening and informational purposes only.
                        It is not a diagnosis. Please consult a qualified healthcare provider for clinical evaluation.
                    </Text>
                </View>

            </Page>
        </Document>
    );
};

export default MedicalReportPDF;
