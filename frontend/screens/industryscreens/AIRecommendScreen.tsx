/**
 * AIRecommendScreen.tsx
 * Gemini AI-powered student recommendation engine.
 * - Tab 1: Search mode — rank students for a custom post
 * - Tab 2: Posts view — all posts with AI-matched students listed under each
 * Keyboard fix: TextInputs live in a stable ScrollView, never inside FlatList header.
 * Gemini fix: Updated to gemini-2.0-flash model with better error logging.
 */
import { CONSTANT } from "@/constants/constant";



import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated, Dimensions, KeyboardAvoidingView, Modal,
  Platform, ScrollView, StatusBar, StyleSheet, Text,
  TextInput, TouchableOpacity, Keyboard, View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// ─── GEMINI ───────────────────────────────────────────────────────
// const GEMINI_API_KEY = "AIzaSyAEet8v2U-HhJx0gAOIGM_wwowM0M0EHSM";
// // ✅ FIXED: Updated from gemini-1.5-flash to gemini-2.0-flash
// const GEMINI_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";



// async function callGemini(prompt: string): Promise<string> {
//   const res = await fetch("http://192.168.0.245:5000/api/ai/recommend", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ prompt }),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data?.error || "AI error");
//   }

//   // return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
//   return data.text;
// }

async function callGemini(prompt: string) {
  // const res = await fetch("http://192.168.0.245:5000/api/ai/recommend", 

  const res = await fetch(
  `${CONSTANT.API_BASE_URL}/api/ai/recommend`,
    {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  return data.text;
}


function parseJSON(raw: string): any[] {
  try { return JSON.parse(raw.replace(/```json|```/g, "").trim()); }
  catch { const m = raw.match(/\[[\s\S]*\]/); return m ? JSON.parse(m[0]) : []; }
}

// ─── SHARED STUDENT DATA ─────────────────────────────────────────
export interface AppStudent {
  _id: string; studentName: string; university: string; degree: string;
  semester: string; cgpa: string; opportunityTitle: string;
  opportunityType: "Internship" | "Project" | "Workshop";
  status: string; skills: string[]; bio: string;
  email?: string; phone?: string; github?: string; linkedIn?: string; portfolio?: string;
}

export const ALL_STUDENTS: AppStudent[] = [
  { _id:"a1",  studentName:"Ayesha Tariq",      university:"NUCES Islamabad",         degree:"BS Computer Science",      semester:"6th Semester", cgpa:"3.72", opportunityTitle:"Frontend Developer Intern",  opportunityType:"Internship", status:"Under Review", skills:["React Native","JavaScript","Figma","UI/UX","TypeScript","CSS"],            bio:"Passionate frontend developer with hands-on experience in React Native and Flutter.",           email:"ayesha.tariq@nu.edu.pk",      phone:"+92 321 1234567", github:"github.com/ayesha-dev",  linkedIn:"linkedin.com/in/ayeshatariq" },
  { _id:"a2",  studentName:"Hassan Ali Mir",     university:"COMSATS University",      degree:"BS Software Engineering",  semester:"7th Semester", cgpa:"3.55", opportunityTitle:"AI Research Project",        opportunityType:"Project",    status:"Pending",      skills:["Python","TensorFlow","Machine Learning","Data Science","NLP","OpenCV"],    bio:"ML enthusiast working on NLP and computer vision projects. Published internationally.",         email:"hassan.mir@comsats.edu.pk",   phone:"+92 333 9876543", github:"github.com/hassanmir" },
  { _id:"a3",  studentName:"Zara Mahmood",       university:"Quaid-i-Azam University", degree:"BS Data Science",          semester:"5th Semester", cgpa:"3.88", opportunityTitle:"Data Science Bootcamp",      opportunityType:"Workshop",   status:"Approved",     skills:["Python","SQL","Tableau","Statistics","Power BI","Excel"],                  bio:"Data science student passionate about visualization and BI. Top 15% on Kaggle.",               email:"zara.mahmood@qau.edu.pk",     phone:"+92 312 5551234", linkedIn:"linkedin.com/in/zaramahmood" },
  { _id:"a4",  studentName:"Bilal Ahmed Khan",   university:"FAST Lahore",             degree:"BS Software Engineering",  semester:"8th Semester", cgpa:"3.65", opportunityTitle:"Backend Developer Intern",   opportunityType:"Internship", status:"Pending",      skills:["Node.js","Express","MongoDB","REST APIs","Docker","AWS"],                  bio:"Backend developer focused on scalable microservices. Built 5+ production APIs.",               email:"bilal.khan@fast.edu.pk",      phone:"+92 300 4567890", github:"github.com/bilalkhan",   linkedIn:"linkedin.com/in/bilalahmedkhan" },
  { _id:"a5",  studentName:"Fatima Noor",        university:"UET Lahore",              degree:"BS Computer Engineering",  semester:"6th Semester", cgpa:"3.91", opportunityTitle:"Full Stack Intern",          opportunityType:"Internship", status:"Under Review", skills:["React","Node.js","PostgreSQL","TypeScript","GraphQL","Redis"],             bio:"Full-stack developer with strong fundamentals. Won HackFest 2024.",                            email:"fatima.noor@uet.edu.pk",      phone:"+92 315 8901234", github:"github.com/fatimanoor" },
  { _id:"a6",  studentName:"Usman Ghani",        university:"IBA Karachi",             degree:"BS Computer Science",      semester:"7th Semester", cgpa:"3.44", opportunityTitle:"Mobile App Developer",       opportunityType:"Internship", status:"Pending",      skills:["Flutter","Dart","Firebase","React Native","iOS","Android"],               bio:"Cross-platform mobile developer with 3 published apps on Play Store.",                         email:"usman.ghani@iba.edu.pk",      phone:"+92 311 2345678", github:"github.com/usmanghani" },
  { _id:"a7",  studentName:"Mariam Siddiqui",    university:"LUMS",                    degree:"BS Computer Science",      semester:"8th Semester", cgpa:"3.95", opportunityTitle:"AI/ML Research Project",     opportunityType:"Project",    status:"Approved",     skills:["Python","PyTorch","Scikit-learn","Data Analysis","LLMs","Transformers"],  bio:"AI researcher with publications in NLP and generative models. Top scorer in batch.",           email:"mariam.siddiqui@lums.edu.pk", phone:"+92 322 3456789", github:"github.com/mariam-ai",   linkedIn:"linkedin.com/in/mariamsiddiqui" },
  { _id:"a8",  studentName:"Ahmed Raza Qureshi", university:"NUST",                    degree:"BS Electrical Engineering",semester:"6th Semester", cgpa:"3.38", opportunityTitle:"IoT Workshop",               opportunityType:"Workshop",   status:"Pending",      skills:["Arduino","Raspberry Pi","C++","Python","Embedded Systems","MQTT"],        bio:"Hardware enthusiast building smart home automation. IEEE Robotics Competition winner.",         email:"ahmed.raza@nust.edu.pk",      phone:"+92 333 4567891", github:"github.com/ahmedraza" },
  { _id:"a9",  studentName:"Sara Jamil",         university:"Air University",          degree:"BS Data Science",          semester:"5th Semester", cgpa:"3.76", opportunityTitle:"Business Analyst Intern",    opportunityType:"Internship", status:"Pending",      skills:["Excel","SQL","Power BI","Data Visualization","Tableau","R"],              bio:"Aspiring business analyst with strong analytical skills and attention to detail.",              email:"sara.jamil@au.edu.pk",        phone:"+92 310 5678912", linkedIn:"linkedin.com/in/sarajamil" },
  { _id:"a10", studentName:"Hamza Tariq",        university:"SZABIST Islamabad",       degree:"BS Software Engineering",  semester:"7th Semester", cgpa:"3.52", opportunityTitle:"DevOps Intern",              opportunityType:"Internship", status:"Under Review", skills:["Docker","Kubernetes","CI/CD","AWS","Linux","Terraform"],                  bio:"DevOps enthusiast with hands-on experience in cloud infrastructure automation.",               email:"hamza.tariq@szabist.edu.pk",  phone:"+92 321 6789123", github:"github.com/hamzatariq" },
  { _id:"a11", studentName:"Hira Baig",          university:"NUCES Karachi",           degree:"BS Computer Science",      semester:"8th Semester", cgpa:"3.82", opportunityTitle:"UI/UX Design Intern",        opportunityType:"Internship", status:"Pending",      skills:["Figma","Adobe XD","Prototyping","User Research","Design Systems","Sketch"],bio:"Design-focused developer bridging engineering and creativity.",                                email:"hira.baig@nu.edu.pk",         phone:"+92 300 7891234", linkedIn:"linkedin.com/in/hirabaig", portfolio:"hirabaig.design" },
  { _id:"a12", studentName:"Zain ul Abideen",    university:"COMSATS Wah",             degree:"BS Cyber Security",        semester:"6th Semester", cgpa:"3.61", opportunityTitle:"Security Analyst Intern",    opportunityType:"Internship", status:"Pending",      skills:["Penetration Testing","Wireshark","Kali Linux","OWASP","Python","Network Security"],bio:"Cyber security student with CTF experience and bug bounty findings.",                      email:"zain.abideen@comsats.edu.pk", phone:"+92 315 8912345", github:"github.com/zainabideen" },
];

// ─── ALL POSTS ────────────────────────────────────────────────────
interface Post {
  id: string; title: string; type: "Internship" | "Project" | "Workshop";
  skills: string[]; description: string;
}

const ALL_POSTS: Post[] = [
  { id:"p1", title:"Frontend Developer Intern",  type:"Internship", skills:["React","JavaScript","TypeScript","UI/UX","CSS","Figma"],          description:"Build beautiful, responsive UIs for our web platform with the design team." },
  { id:"p2", title:"AI/ML Research Project",     type:"Project",    skills:["Python","TensorFlow","Machine Learning","NLP","PyTorch","LLMs"],  description:"Research and implement NLP models for document understanding." },
  { id:"p3", title:"Full Stack Developer",        type:"Internship", skills:["Node.js","React","MongoDB","REST APIs","PostgreSQL","TypeScript"], description:"End-to-end development of our SaaS dashboard features." },
  { id:"p4", title:"Mobile App Developer",        type:"Internship", skills:["React Native","Flutter","Firebase","iOS","Android","Dart"],       description:"Cross-platform mobile development for our customer-facing app." },
  { id:"p5", title:"Data Science Bootcamp",       type:"Workshop",   skills:["Python","SQL","Tableau","Statistics","Power BI","R"],            description:"Intensive data analytics workshop for aspiring data scientists." },
  { id:"p6", title:"DevOps Engineer Intern",      type:"Internship", skills:["Docker","Kubernetes","AWS","CI/CD","Linux","Terraform"],          description:"Automate our CI/CD pipeline and manage cloud infrastructure." },
];

// ─── TYPES ────────────────────────────────────────────────────────
interface Rec {
  studentId: string; studentName: string; university: string; degree: string;
  cgpa: string; matchScore: number; matchedSkills: string[];
  missingSkills: string[]; aiReason: string;
}

interface PostResult { post: Post; recs: Rec[]; loading: boolean; error: string; }

// ─── COLOR MAPS ───────────────────────────────────────────────────
const TYPE_COLOR: Record<string, { color: string; bg: string; grad: [string, string] }> = {
  Internship: { color:"#0066CC", bg:"#E8F4FF", grad:["#0066CC","#004999"] },
  Project:    { color:"#6A1B9A", bg:"#F3E5F5", grad:["#6A1B9A","#4A148C"] },
  Workshop:   { color:"#E65100", bg:"#FFF3E0", grad:["#E65100","#BF360C"] },
};

const STATUS_COLOR: Record<string,{color:string;bg:string}> = {
  "Approved":     {color:"#059669", bg:"#D1FAE5"},
  "Rejected":     {color:"#DC2626", bg:"#FEE2E2"},
  "Under Review": {color:"#D97706", bg:"#FEF3C7"},
  "Pending":      {color:"#6366F1", bg:"#EEF2FF"},
};

const initials = (n: string) =>
  n.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

// ─── SCORE BADGE ─────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color = score>=80?"#059669":score>=60?"#D97706":score>=40?"#6366F1":"#DC2626";
  const bg    = score>=80?"#D1FAE5":score>=60?"#FEF3C7":score>=40?"#EEF2FF":"#FEE2E2";
  const lbl   = score>=80?"Excellent":score>=60?"Good":score>=40?"Fair":"Low";
  return (
    <View style={[zs.badge,{backgroundColor:bg,borderColor:color+"40"}]}>
      <Text style={[zs.score,{color}]}>{score}%</Text>
      <Text style={[zs.lbl,{color}]}>{lbl}</Text>
    </View>
  );
}
const zs = StyleSheet.create({
  badge: {alignItems:"center",borderRadius:12,paddingHorizontal:10,paddingVertical:7,borderWidth:1.5},
  score: {fontSize:15,fontWeight:"900"},
  lbl:   {fontSize:9,fontWeight:"700",marginTop:1},
});

// ─── STUDENT DETAIL MODAL ─────────────────────────────────────────
function StudentDetailModal({
  student, rec, onClose,
}: { student: AppStudent|null; rec: Rec|null; onClose:()=>void }) {
  if (!student) return null;
  const sc = STATUS_COLOR[student.status] || STATUS_COLOR["Pending"];

  return (
    <Modal visible={!!student} transparent animationType="slide" onRequestClose={onClose}>
      <View style={sd.overlay}>
        <TouchableOpacity style={{flex:1}} onPress={onClose} activeOpacity={1}/>
        <View style={sd.sheet}>
          <View style={sd.handle}/>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Hero */}
            <LinearGradient colors={["#050D1A","#0A1628","#0D2137"]} style={sd.hero}>
              <TouchableOpacity onPress={onClose} style={sd.closeBtn}>
                <Ionicons name="close" size={17} color="rgba(255,255,255,0.6)"/>
              </TouchableOpacity>
              <View style={sd.heroAv}>
                <Text style={sd.heroAvTxt}>{initials(student.studentName)}</Text>
              </View>
              <Text style={sd.heroName}>{student.studentName}</Text>
              <Text style={sd.heroDeg}>{student.degree} · {student.semester}</Text>
              <Text style={sd.heroUni}>{student.university}</Text>
              <View style={{flexDirection:"row",gap:10,marginTop:14,alignItems:"center",flexWrap:"wrap",justifyContent:"center"}}>
                <View style={[sd.statusBadge,{backgroundColor:sc.bg}]}>
                  <Text style={[sd.statusBadgeTxt,{color:sc.color}]}>{student.status}</Text>
                </View>
                {rec && <ScoreBadge score={rec.matchScore}/>}
              </View>
            </LinearGradient>

            <View style={sd.body}>
              {/* AI Reason */}
              {rec && (
                <View style={sd.aiBox}>
                  <View style={sd.aiBoxHead}>
                    <Ionicons name="sparkles" size={14} color="#6366F1"/>
                    <Text style={sd.aiBoxTitle}>Gemini AI Analysis</Text>
                  </View>
                  <Text style={sd.aiBoxText}>{rec.aiReason}</Text>
                </View>
              )}

              {/* Stats */}
              <View style={sd.statsRow}>
                {[
                  {val:student.cgpa,                                             key:"CGPA"},
                  {val:rec?`${rec.matchScore}%`:"—",                             key:"Match"},
                  {val:rec?rec.matchedSkills.length:student.skills.length,       key:rec?"Matched":"Skills"},
                ].map((st,i)=>(
                  <View key={i} style={[sd.statBox,i===1&&sd.statBorder]}>
                    <Text style={sd.statVal}>{st.val}</Text>
                    <Text style={sd.statKey}>{st.key}</Text>
                  </View>
                ))}
              </View>

              {/* Skill match */}
              {rec && (rec.matchedSkills.length>0||rec.missingSkills.length>0) && (
                <View style={sd.sec}>
                  <Text style={sd.secTitle}>Skill Match</Text>
                  <View style={sd.skillsRow}>
                    {rec.matchedSkills.map((sk,i)=>(
                      <View key={i} style={sd.matchedChip}>
                        <Ionicons name="checkmark-circle" size={11} color="#059669"/>
                        <Text style={sd.matchedChipTxt}>{sk}</Text>
                      </View>
                    ))}
                    {rec.missingSkills.map((sk,i)=>(
                      <View key={i} style={sd.missingChip}>
                        <Ionicons name="close-circle" size={11} color="#DC2626"/>
                        <Text style={sd.missingChipTxt}>{sk}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Bio */}
              <View style={sd.sec}>
                <Text style={sd.secTitle}>About</Text>
                <Text style={sd.bio}>{student.bio}</Text>
              </View>

              {/* All Skills */}
              <View style={sd.sec}>
                <Text style={sd.secTitle}>All Skills</Text>
                <View style={sd.skillsRow}>
                  {student.skills.map((sk,i)=>(
                    <View key={i} style={sd.skillChip}>
                      <Text style={sd.skillChipTxt}>{sk}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Contact */}
              {(student.email||student.phone||student.github||student.linkedIn) && (
                <View style={sd.sec}>
                  <Text style={sd.secTitle}>Contact</Text>
                  {([
                    student.email     && {icon:"mail-outline",  val:student.email},
                    student.phone     && {icon:"call-outline",  val:student.phone},
                    student.github    && {icon:"logo-github",   val:student.github},
                    student.linkedIn  && {icon:"logo-linkedin", val:student.linkedIn},
                    student.portfolio && {icon:"globe-outline", val:student.portfolio},
                  ] as any[]).filter(Boolean).map((c:any,i:number)=>(
                    <View key={i} style={sd.contactRow}>
                      <View style={sd.contactIcon}>
                        <Ionicons name={c.icon} size={14} color="#0066CC"/>
                      </View>
                      <Text style={sd.contactTxt} numberOfLines={1}>{c.val}</Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={{height:20}}/>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const sd = StyleSheet.create({
  overlay:        {flex:1,backgroundColor:"rgba(0,0,0,0.6)",justifyContent:"flex-end"},
  sheet:          {backgroundColor:"#fff",borderTopLeftRadius:28,borderTopRightRadius:28,maxHeight:height*0.9,overflow:"hidden"},
  handle:         {width:42,height:4,borderRadius:2,backgroundColor:"#E2E8F0",alignSelf:"center",marginTop:12},
  hero:           {paddingTop:22,paddingHorizontal:22,paddingBottom:26,alignItems:"center",overflow:"hidden"},
  closeBtn:       {position:"absolute",top:14,right:14,width:30,height:30,borderRadius:15,backgroundColor:"rgba(255,255,255,0.1)",justifyContent:"center",alignItems:"center"},
  heroAv:         {width:72,height:72,borderRadius:36,backgroundColor:"#1E3A5F",justifyContent:"center",alignItems:"center",borderWidth:3,borderColor:"rgba(255,255,255,0.2)",marginBottom:12},
  heroAvTxt:      {fontSize:22,fontWeight:"900",color:"#fff"},
  heroName:       {fontSize:19,fontWeight:"900",color:"#fff",textAlign:"center"},
  heroDeg:        {fontSize:13,color:"rgba(255,255,255,0.55)",marginTop:4,textAlign:"center"},
  heroUni:        {fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2,textAlign:"center"},
  statusBadge:    {paddingHorizontal:12,paddingVertical:6,borderRadius:20},
  statusBadgeTxt: {fontSize:12,fontWeight:"700"},
  body:           {padding:18},
  aiBox:          {backgroundColor:"#F5F3FF",borderRadius:14,padding:14,marginBottom:18,borderWidth:1.5,borderColor:"#DDD6FE"},
  aiBoxHead:      {flexDirection:"row",alignItems:"center",gap:7,marginBottom:8},
  aiBoxTitle:     {fontSize:12,fontWeight:"800",color:"#4C1D95"},
  aiBoxText:      {fontSize:12,color:"#5B21B6",lineHeight:19},
  statsRow:       {flexDirection:"row",backgroundColor:"#F8FAFC",borderRadius:14,marginBottom:18,borderWidth:1,borderColor:"#E2E8F0",overflow:"hidden"},
  statBox:        {flex:1,padding:14,alignItems:"center"},
  statBorder:     {borderLeftWidth:1,borderRightWidth:1,borderColor:"#E2E8F0"},
  statVal:        {fontSize:16,fontWeight:"900",color:"#0A1628"},
  statKey:        {fontSize:11,color:"#94A3B8",marginTop:3,fontWeight:"600"},
  sec:            {marginBottom:18},
  secTitle:       {fontSize:13,fontWeight:"800",color:"#0A1628",marginBottom:9},
  bio:            {fontSize:13,color:"#475569",lineHeight:20},
  skillsRow:      {flexDirection:"row",flexWrap:"wrap",gap:7},
  matchedChip:    {flexDirection:"row",alignItems:"center",gap:4,backgroundColor:"#D1FAE5",paddingHorizontal:9,paddingVertical:4,borderRadius:20},
  matchedChipTxt: {fontSize:11,fontWeight:"700",color:"#059669"},
  missingChip:    {flexDirection:"row",alignItems:"center",gap:4,backgroundColor:"#FEE2E2",paddingHorizontal:9,paddingVertical:4,borderRadius:20},
  missingChipTxt: {fontSize:11,fontWeight:"700",color:"#DC2626"},
  skillChip:      {backgroundColor:"#EFF6FF",borderRadius:20,paddingHorizontal:11,paddingVertical:5,borderWidth:1,borderColor:"#BFDBFE"},
  skillChipTxt:   {fontSize:11,fontWeight:"700",color:"#1D4ED8"},
  contactRow:     {flexDirection:"row",alignItems:"center",gap:9,paddingVertical:9,borderBottomWidth:1,borderColor:"#F1F5F9"},
  contactIcon:    {width:32,height:32,borderRadius:9,backgroundColor:"#EFF6FF",justifyContent:"center",alignItems:"center"},
  contactTxt:     {flex:1,fontSize:13,color:"#334155",fontWeight:"500"},
});

// ─── MINI STUDENT ROW inside post card ───────────────────────────
function StudentRow({ rec, rank, onPress }: { rec:Rec; rank:number; onPress:()=>void }) {
  const rankColors = ["#F59E0B","#94A3B8","#CD7C2F"];
  const isTop = rank < 3;
  return (
    <TouchableOpacity style={mr.row} onPress={onPress} activeOpacity={0.82}>
      <View style={[mr.rankBadge,{backgroundColor:isTop?rankColors[rank]:"#E2E8F0"}]}>
        <Text style={[mr.rankTxt,{color:isTop?"#fff":"#64748B"}]}>#{rank+1}</Text>
      </View>
      <View style={mr.avatar}>
        <Text style={mr.avatarTxt}>{initials(rec.studentName)}</Text>
      </View>
      <View style={{flex:1}}>
        <Text style={mr.name}>{rec.studentName}</Text>
        <Text style={mr.uni} numberOfLines={1}>{rec.university}</Text>
        <View style={{flexDirection:"row",flexWrap:"wrap",gap:4,marginTop:4}}>
          {rec.matchedSkills.slice(0,3).map((sk,i)=>(
            <View key={i} style={mr.mPill}><Text style={mr.mPillTxt}>{sk}</Text></View>
          ))}
          {rec.matchedSkills.length>3 && (
            <View style={[mr.mPill,{backgroundColor:"#F1F5F9"}]}>
              <Text style={[mr.mPillTxt,{color:"#64748B"}]}>+{rec.matchedSkills.length-3}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={{alignItems:"flex-end",gap:4}}>
        <ScoreBadge score={rec.matchScore}/>
        <Ionicons name="chevron-forward" size={13} color="#94A3B8"/>
      </View>
    </TouchableOpacity>
  );
}
const mr = StyleSheet.create({
  row:      {flexDirection:"row",alignItems:"center",gap:10,paddingVertical:12,paddingHorizontal:14,borderBottomWidth:1,borderColor:"#F8FAFC"},
  rankBadge:{width:24,height:24,borderRadius:12,justifyContent:"center",alignItems:"center"},
  rankTxt:  {fontSize:10,fontWeight:"900"},
  avatar:   {width:38,height:38,borderRadius:19,backgroundColor:"#0A1628",justifyContent:"center",alignItems:"center",borderWidth:1.5,borderColor:"#E2E8F0"},
  avatarTxt:{fontSize:12,fontWeight:"900",color:"#fff"},
  name:     {fontSize:13,fontWeight:"700",color:"#0A1628"},
  uni:      {fontSize:11,color:"#94A3B8"},
  mPill:    {backgroundColor:"#D1FAE5",paddingHorizontal:7,paddingVertical:3,borderRadius:20},
  mPillTxt: {fontSize:10,fontWeight:"700",color:"#059669"},
});

// ─── POST CARD ────────────────────────────────────────────────────
function PostCard({
  pr, onLoadRecs, onStudentPress,
}: { pr:PostResult; onLoadRecs:()=>void; onStudentPress:(rec:Rec)=>void }) {
  const [expanded, setExpanded] = useState(false);
  const tc = TYPE_COLOR[pr.post.type];

  return (
    <View style={pc.card}>
      {/* Banner */}
      <LinearGradient colors={tc.grad} style={pc.banner} start={{x:0,y:0}} end={{x:1,y:0}}>
        <View style={pc.bannerDecor}/>
        <View style={{flex:1}}>
          <View style={pc.typePill}>
            <Text style={pc.typePillTxt}>{pr.post.type}</Text>
          </View>
          <Text style={pc.bannerTitle}>{pr.post.title}</Text>
          <Text style={pc.bannerDesc} numberOfLines={2}>{pr.post.description}</Text>
        </View>
      </LinearGradient>

      {/* Required skills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={pc.skillsBar} contentContainerStyle={{gap:6,paddingHorizontal:14,paddingVertical:10}}>
        {pr.post.skills.map((sk,i)=>(
          <View key={i} style={[pc.skillPill,{backgroundColor:tc.bg}]}>
            <Text style={[pc.skillPillTxt,{color:tc.color}]}>{sk}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Action */}
      <View style={pc.actionRow}>
        {pr.recs.length > 0 ? (
          <TouchableOpacity style={pc.expandBtn} onPress={()=>setExpanded(!expanded)}>
            <Ionicons name="people" size={14} color="#0066CC"/>
            <Text style={pc.expandBtnTxt}>{pr.recs.length} matched students</Text>
            <Ionicons name={expanded?"chevron-up":"chevron-down"} size={14} color="#0066CC"/>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[pc.analyzeWrap,pr.loading&&{opacity:0.65}]}
            onPress={onLoadRecs} disabled={pr.loading}>
            <LinearGradient colors={["#4F46E5","#6D28D9"]} style={pc.analyzeGrad}
              start={{x:0,y:0}} end={{x:1,y:0}}>
              <Ionicons name={pr.loading?"hourglass":"sparkles"} size={14} color="#fff"/>
              <Text style={pc.analyzeTxt}>{pr.loading?"Analyzing...":"Find Matches with AI"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {!!pr.error && <Text style={pc.errorTxt}>{pr.error}</Text>}
      </View>

      {/* Student list */}
      {expanded && pr.recs.length>0 && (
        <View style={pc.studentList}>
          {pr.recs.map((rec,i)=>(
            <StudentRow key={rec.studentId} rec={rec} rank={i}
              onPress={()=>onStudentPress(rec)}/>
          ))}
        </View>
      )}
    </View>
  );
}
const pc = StyleSheet.create({
  card:        {backgroundColor:"#fff",borderRadius:18,overflow:"hidden",marginBottom:14,shadowColor:"#000",shadowOpacity:0.07,shadowRadius:10,elevation:4},
  banner:      {padding:16,overflow:"hidden"},
  bannerDecor: {position:"absolute",width:120,height:120,borderRadius:60,backgroundColor:"rgba(255,255,255,0.08)",top:-30,right:-30},
  typePill:    {alignSelf:"flex-start",backgroundColor:"rgba(255,255,255,0.22)",paddingHorizontal:10,paddingVertical:4,borderRadius:20,marginBottom:7},
  typePillTxt: {fontSize:10,fontWeight:"700",color:"#fff"},
  bannerTitle: {fontSize:15,fontWeight:"900",color:"#fff"},
  bannerDesc:  {fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:4,lineHeight:17},
  skillsBar:   {borderBottomWidth:1,borderColor:"#F1F5F9"},
  skillPill:   {paddingHorizontal:10,paddingVertical:4,borderRadius:20},
  skillPillTxt:{fontSize:11,fontWeight:"700"},
  actionRow:   {padding:12},
  expandBtn:   {flexDirection:"row",alignItems:"center",gap:7,backgroundColor:"#EFF6FF",paddingHorizontal:14,paddingVertical:10,borderRadius:12},
  expandBtnTxt:{flex:1,fontSize:13,fontWeight:"700",color:"#0066CC"},
  analyzeWrap: {borderRadius:12,overflow:"hidden"},
  analyzeGrad: {flexDirection:"row",alignItems:"center",justifyContent:"center",gap:8,paddingVertical:12,paddingHorizontal:16},
  analyzeTxt:  {fontSize:13,fontWeight:"700",color:"#fff"},
  errorTxt:    {fontSize:11,color:"#DC2626",marginTop:6},
  studentList: {borderTopWidth:1,borderColor:"#F1F5F9"},
});

// ─── SEARCH RESULT CARD ───────────────────────────────────────────
function SearchRecCard({ rec, rank, onPress }: { rec:Rec; rank:number; onPress:()=>void }) {
  const rankColors = ["#F59E0B","#94A3B8","#CD7C2F"];
  const rankIcons  = ["trophy","medal","ribbon"] as const;
  return (
    <TouchableOpacity style={src.card} onPress={onPress} activeOpacity={0.88}>
      <LinearGradient
        colors={rank<3?[rankColors[rank],rankColors[rank]+"99"]:["#0066CC","#0080EE"]}
        style={src.stripe} start={{x:0,y:0}} end={{x:1,y:0}}/>
      <View style={src.inner}>
        {/* Avatar + rank */}
        <View style={{alignItems:"center",marginRight:12}}>
          <View style={src.avatar}>
            <Text style={src.avatarTxt}>{initials(rec.studentName)}</Text>
          </View>
          <View style={[src.rankBadge,{backgroundColor:rank<3?rankColors[rank]:"#64748B"}]}>
            {rank<3
              ? <Ionicons name={rankIcons[rank]} size={8} color="#fff"/>
              : <Text style={{fontSize:8,fontWeight:"900",color:"#fff"}}>#{rank+1}</Text>}
          </View>
        </View>
        {/* Info */}
        <View style={{flex:1}}>
          <Text style={src.name}>{rec.studentName}</Text>
          <Text style={src.deg}>{rec.degree}</Text>
          <Text style={src.uni}>{rec.university}</Text>
          <View style={{flexDirection:"row",flexWrap:"wrap",gap:5,marginTop:8}}>
            {rec.matchedSkills.slice(0,3).map((sk,i)=>(
              <View key={i} style={src.mPill}>
                <Ionicons name="checkmark" size={9} color="#059669"/>
                <Text style={src.mPillTxt}>{sk}</Text>
              </View>
            ))}
            {rec.missingSkills.slice(0,2).map((sk,i)=>(
              <View key={i} style={src.xPill}>
                <Ionicons name="close" size={9} color="#DC2626"/>
                <Text style={src.xPillTxt}>{sk}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Score */}
        <View style={{alignItems:"flex-end",gap:7}}>
          <ScoreBadge score={rec.matchScore}/>
          <Text style={src.cgpa}>⭐ {rec.cgpa}</Text>
        </View>
      </View>
      <View style={src.reasonBox}>
        <Ionicons name="sparkles" size={11} color="#6366F1"/>
        <Text style={src.reasonTxt} numberOfLines={2}>{rec.aiReason}</Text>
      </View>
    </TouchableOpacity>
  );
}
const src = StyleSheet.create({
  card:      {backgroundColor:"#fff",borderRadius:18,overflow:"hidden",marginBottom:12,shadowColor:"#000",shadowOpacity:0.07,shadowRadius:10,elevation:4},
  stripe:    {width:"100%",height:4},
  inner:     {flexDirection:"row",alignItems:"flex-start",padding:14},
  avatar:    {width:46,height:46,borderRadius:23,backgroundColor:"#0A1628",justifyContent:"center",alignItems:"center",borderWidth:2,borderColor:"#E2E8F0"},
  avatarTxt: {fontSize:14,fontWeight:"900",color:"#fff"},
  rankBadge: {marginTop:-5,paddingHorizontal:5,paddingVertical:2,borderRadius:10,flexDirection:"row",alignItems:"center",gap:2},
  name:      {fontSize:14,fontWeight:"800",color:"#0A1628"},
  deg:       {fontSize:12,color:"#475569",marginTop:2},
  uni:       {fontSize:11,color:"#94A3B8",marginTop:1},
  mPill:     {flexDirection:"row",alignItems:"center",gap:3,backgroundColor:"#D1FAE5",paddingHorizontal:7,paddingVertical:3,borderRadius:20},
  mPillTxt:  {fontSize:10,fontWeight:"700",color:"#059669"},
  xPill:     {flexDirection:"row",alignItems:"center",gap:3,backgroundColor:"#FEE2E2",paddingHorizontal:7,paddingVertical:3,borderRadius:20},
  xPillTxt:  {fontSize:10,fontWeight:"700",color:"#DC2626"},
  cgpa:      {fontSize:11,fontWeight:"700",color:"#F59E0B"},
  reasonBox: {flexDirection:"row",alignItems:"flex-start",gap:6,backgroundColor:"#F5F3FF",marginHorizontal:14,marginBottom:14,padding:9,borderRadius:11},
  reasonTxt: {flex:1,fontSize:11,color:"#4C1D95",lineHeight:16,fontWeight:"500"},
});

// ─── MAIN SCREEN ─────────────────────────────────────────────────
export function AIRecommendScreen() {
  const nav = useNavigation<any>();

  const [activeTab,       setActiveTab]       = useState<"search"|"posts">("search");
  const [jobTitle,        setJobTitle]        = useState("");
  const [requiredSkills,  setRequiredSkills]  = useState("");
  const [searchLoading,   setSearchLoading]   = useState(false);
  const [searchRecs,      setSearchRecs]      = useState<Rec[]>([]);
  const [searchError,     setSearchError]     = useState("");
  const [selectedPreset,  setSelectedPreset]  = useState<string|null>(null);
  const [postResults,     setPostResults]     = useState<PostResult[]>(
    ALL_POSTS.map(p=>({post:p, recs:[], loading:false, error:""}))
  );
  const [detailStudent,   setDetailStudent]   = useState<AppStudent|null>(null);
  const [detailRec,       setDetailRec]       = useState<Rec|null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const PRESETS = [
    {id:"q1", title:"Frontend Dev",  skills:"React, JavaScript, TypeScript, CSS, Figma"},
    {id:"q2", title:"AI / ML",       skills:"Python, TensorFlow, NLP, PyTorch, LLMs"},
    {id:"q3", title:"Full Stack",    skills:"Node.js, React, MongoDB, REST APIs, PostgreSQL"},
    {id:"q4", title:"Mobile Dev",    skills:"React Native, Flutter, Firebase, iOS, Android"},
    {id:"q5", title:"Data Science",  skills:"Python, SQL, Tableau, Statistics, Power BI"},
    {id:"q6", title:"DevOps",        skills:"Docker, Kubernetes, AWS, CI/CD, Linux"},
  ];

  const openDetail = useCallback((rec: Rec) => {
    const student = ALL_STUDENTS.find(s=>s._id===rec.studentId)||null;
    setDetailStudent(student);
    setDetailRec(rec);
  }, []);

  const buildPrompt = (title: string, skills: string[]) =>
    `You are an AI recruitment assistant. Analyze these ${ALL_STUDENTS.length} student applications for the position "${title}" which requires: ${skills.join(", ")}.

APPLICATIONS:
${ALL_STUDENTS.map(a=>`ID:${a._id}|Name:${a.studentName}|Uni:${a.university}|Degree:${a.degree}|CGPA:${a.cgpa}|Skills:${a.skills.join(",")}|Bio:${a.bio}`).join("\n")}

Return a raw JSON array (no markdown fences) ranking ALL ${ALL_STUDENTS.length} students. Each object must have:
- studentId: string
- studentName: string
- matchScore: number (0-100)
- matchedSkills: string[]
- missingSkills: string[]
- aiReason: string (2 sentences)

Sort by matchScore descending.`;

  const analyzeSearch = async () => {
    Keyboard.dismiss();
    if (!jobTitle.trim()||!requiredSkills.trim()) {
      setSearchError("Please enter a job title and required skills."); return;
    }
    setSearchLoading(true); setSearchError(""); setSearchRecs([]);
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim,{toValue:1.04,duration:700,useNativeDriver:true}),
      Animated.timing(pulseAnim,{toValue:1,  duration:700,useNativeDriver:true}),
    ])).start();
    try {
      const skills = requiredSkills.split(",").map(s=>s.trim()).filter(Boolean);
      const raw    = await callGemini(buildPrompt(jobTitle,skills));
      // const parsed = parseJSON(raw) as Rec[];
      const parsed = (parseJSON(raw) || []) as Rec[];
      // setSearchRecs(parsed.map(r=>({
      //   ...r,
      //   cgpa:       ALL_STUDENTS.find(s=>s._id===r.studentId)?.cgpa       ||"N/A",
      //   university: ALL_STUDENTS.find(s=>s._id===r.studentId)?.university  ||"",
      //   degree:     ALL_STUDENTS.find(s=>s._id===r.studentId)?.degree      ||"",
      // })));
      setSearchRecs(
  (parsed || []).map(r => ({
    studentId: r.studentId ?? "",
    studentName: r.studentName ?? "Unknown",
    matchScore: r.matchScore ?? 0,
    matchedSkills: r.matchedSkills ?? [],
    missingSkills: r.missingSkills ?? [],
    aiReason: r.aiReason ?? "No AI reason provided",

    cgpa: ALL_STUDENTS.find(s => s._id === r.studentId)?.cgpa ?? "N/A",
    university: ALL_STUDENTS.find(s => s._id === r.studentId)?.university ?? "",
    degree: ALL_STUDENTS.find(s => s._id === r.studentId)?.degree ?? "",
  }))
);
    } catch(e:any) {
      setSearchError("Gemini API error: " + e.message);
    } finally {
      setSearchLoading(false); pulseAnim.stopAnimation(); pulseAnim.setValue(1);
    }
  };

  const loadPostRecs = async (idx: number) => {
    const post = ALL_POSTS[idx];
    setPostResults(prev=>prev.map((pr,i)=>i===idx?{...pr,loading:true,error:""}:pr));
    try {
      const raw    = await callGemini(buildPrompt(post.title,post.skills));
      const parsed = parseJSON(raw) as Rec[];
      const enriched = parsed.map(r=>({
        ...r,
        cgpa:       ALL_STUDENTS.find(s=>s._id===r.studentId)?.cgpa       ||"N/A",
        university: ALL_STUDENTS.find(s=>s._id===r.studentId)?.university  ||"",
        degree:     ALL_STUDENTS.find(s=>s._id===r.studentId)?.degree      ||"",
      }));
      setPostResults(prev=>prev.map((pr,i)=>i===idx?{...pr,recs:enriched,loading:false}:pr));
    } catch(e:any) {
      setPostResults(prev=>prev.map((pr,i)=>i===idx?{...pr,loading:false,error:"AI error: "+e.message}:pr));
    }
  };

  const goodMatches = searchRecs.filter(r=>r.matchScore>=60).length;

  return (
    <View style={{flex:1,backgroundColor:"#F0F4F8"}}>
      <StatusBar barStyle="light-content" backgroundColor="#050D1A"/>

      {/* ── Header ── */}
      <LinearGradient colors={["#050D1A","#0A1628","#0D2137"]} style={s.header}
        start={{x:0,y:0}} end={{x:1,y:1}}>
        <View style={s.hDecor}/>
        <View style={s.hRow}>
          <TouchableOpacity onPress={()=>nav.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={21} color="#fff"/>
          </TouchableOpacity>
          <View style={{flex:1,marginLeft:14}}>
            <Text style={s.hTitle}>AI Recommend</Text>
            <Text style={s.hSub}>Gemini-powered skill matching</Text>
          </View>
          <View style={s.gemPill}>
            <Ionicons name="sparkles" size={12} color="#F59E0B"/>
            <Text style={s.gemPillTxt}>Gemini</Text>
          </View>
        </View>
        {/* Stats */}
        <View style={s.statsRow}>
          {[
            {n:ALL_STUDENTS.length,                              lbl:"Students",   c:"#90CAF9"},
            {n:ALL_POSTS.length,                                 lbl:"Posts",      c:"#C4B5FD"},
            {n:searchRecs.length>0?goodMatches:"-",              lbl:"Good Match", c:"#A5D6A7"},
          ].map((st,i)=>(
            <View key={i} style={s.statCard}>
              <Text style={[s.statN,{color:st.c}]}>{st.n}</Text>
              <Text style={s.statLbl}>{st.lbl}</Text>
            </View>
          ))}
        </View>
        {/* Tabs */}
        <View style={s.tabRow}>
          {([["search","Search Students"],["posts","All Posts"]] as const).map(([tab,lbl])=>(
            <TouchableOpacity key={tab} style={[s.tab,activeTab===tab&&s.tabActive]}
              onPress={()=>setActiveTab(tab)}>
              <Ionicons
                name={tab==="search"?"search":"layers"}
                size={13} color={activeTab===tab?"#0A1628":"rgba(255,255,255,0.5)"}/>
              <Text style={[s.tabTxt,activeTab===tab&&s.tabTxtActive]}>{lbl}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* ══ SEARCH TAB ══════════════════════════════════════════════ */}
      {activeTab==="search" && (
        <KeyboardAvoidingView style={{flex:1}}
          behavior={Platform.OS==="ios"?"padding":"height"}>
          <ScrollView
            style={{flex:1}}
            contentContainerStyle={{padding:16,paddingBottom:60}}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none">

            {/* Input card */}
            <View style={s.inputCard}>
              <View style={s.inputHead}>
                <Ionicons name="search" size={15} color="#0066CC"/>
                <Text style={s.inputHeadTxt}>Define Your Post</Text>
              </View>

              <Text style={s.label}>Job / Opportunity Title</Text>
              <TextInput
                style={s.input}
                placeholder="e.g. Frontend Developer Intern"
                placeholderTextColor="#94A3B8"
                value={jobTitle}
                onChangeText={setJobTitle}
                returnKeyType="next"
                blurOnSubmit={false}
                autoCorrect={false}
              />

              <Text style={[s.label,{marginTop:13}]}>Required Skills (comma separated)</Text>
              <TextInput
                style={[s.input,{height:66,textAlignVertical:"top",paddingTop:12}]}
                placeholder="e.g. React, TypeScript, Node.js, REST APIs"
                placeholderTextColor="#94A3B8"
                value={requiredSkills}
                onChangeText={setRequiredSkills}
                multiline
                blurOnSubmit={false}
                autoCorrect={false}
              />

              {!!searchError && (
                <View style={s.errBox}>
                  <Ionicons name="alert-circle" size={13} color="#DC2626"/>
                  <Text style={s.errTxt}>{searchError}</Text>
                </View>
              )}

              <TouchableOpacity onPress={analyzeSearch} disabled={searchLoading} activeOpacity={0.85}>
                <LinearGradient
                  colors={searchLoading?["#64748B","#475569"]:["#4F46E5","#6D28D9"]}
                  style={s.analyzeBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
                  <Animated.View style={{flexDirection:"row",alignItems:"center",gap:9,
                    transform:[{scale:searchLoading?pulseAnim:new Animated.Value(1)}]}}>
                    <Ionicons name={searchLoading?"hourglass":"sparkles"} size={17} color="#fff"/>
                    <Text style={s.analyzeBtnTxt}>
                      {searchLoading?"Analyzing with Gemini...":"Find Best Matches"}
                    </Text>
                  </Animated.View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Quick presets */}
            <View style={[s.secRow,{marginBottom:10}]}>
              <View style={s.secLeft}><View style={s.secBar}/><Text style={s.secTitle}>Quick Select</Text></View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              style={{marginBottom:18}} contentContainerStyle={{gap:8,paddingRight:4}}
              keyboardShouldPersistTaps="handled">
              {PRESETS.map(p=>(
                <TouchableOpacity key={p.id}
                  style={[s.presetChip,selectedPreset===p.id&&s.presetChipActive]}
                  onPress={()=>{
                    setSelectedPreset(p.id);
                    setJobTitle(p.title);
                    setRequiredSkills(p.skills);
                    setSearchRecs([]); setSearchError("");
                  }}>
                  <Text style={[s.presetTxt,selectedPreset===p.id&&s.presetTxtActive]}>{p.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Results */}
            {searchRecs.length>0 && (
              <>
                <View style={[s.secRow,{marginBottom:12}]}>
                  <View style={s.secLeft}>
                    <View style={[s.secBar,{backgroundColor:"#6366F1"}]}/>
                    <Text style={s.secTitle}>AI Rankings</Text>
                  </View>
                  <Text style={s.resultInfo}>{searchRecs.length} students · {goodMatches} good matches</Text>
                </View>
                {searchRecs.map((rec,i)=>(
                  <SearchRecCard key={rec.studentId} rec={rec} rank={i}
                    onPress={()=>openDetail(rec)}/>
                ))}
              </>
            )}

            {/* Empty state */}
            {searchRecs.length===0&&!searchLoading&&!searchError && (
              <View style={s.emptyState}>
                <LinearGradient colors={["#4F46E5","#6D28D9"]} style={s.emptyIconBox}>
                  <Ionicons name="sparkles" size={30} color="#fff"/>
                </LinearGradient>
                <Text style={s.emptyTitle}>AI-Powered Matching</Text>
                <Text style={s.emptySub}>
                  Enter your job requirements and let Gemini AI rank {ALL_STUDENTS.length} student applications by skill relevance.
                </Text>
                {["Skill overlap scoring","CGPA weighting","Personalized AI reasoning"].map((f,i)=>(
                  <View key={i} style={s.featureRow}>
                    <Ionicons name="checkmark-circle" size={13} color="#059669"/>
                    <Text style={s.featureTxt}>{f}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* ══ POSTS TAB ═══════════════════════════════════════════════ */}
      {activeTab==="posts" && (
        <ScrollView style={{flex:1}} contentContainerStyle={{padding:16,paddingBottom:60}}
          showsVerticalScrollIndicator={false}>
          <View style={[s.secRow,{marginBottom:14}]}>
            <View style={s.secLeft}>
              <View style={[s.secBar,{backgroundColor:"#6366F1"}]}/>
              <Text style={s.secTitle}>All Posts</Text>
            </View>
            <Text style={s.resultInfo}>{ALL_POSTS.length} opportunities</Text>
          </View>
          {postResults.map((pr,i)=>(
            <PostCard key={pr.post.id} pr={pr}
              onLoadRecs={()=>loadPostRecs(i)}
              onStudentPress={openDetail}/>
          ))}
        </ScrollView>
      )}

      {/* ── Student Detail Modal ── */}
      <StudentDetailModal
        student={detailStudent}
        rec={detailRec}
        onClose={()=>{setDetailStudent(null);setDetailRec(null);}}
      />
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Header
  header:   {paddingTop:Platform.OS==="ios"?56:44,paddingHorizontal:18,paddingBottom:16,overflow:"hidden"},
  hDecor:   {position:"absolute",width:200,height:200,borderRadius:100,backgroundColor:"rgba(255,255,255,0.03)",top:-70,right:-60},
  hRow:     {flexDirection:"row",alignItems:"center",marginBottom:14},
  backBtn:  {width:38,height:38,borderRadius:12,backgroundColor:"rgba(255,255,255,0.09)",justifyContent:"center",alignItems:"center"},
  hTitle:   {fontSize:19,fontWeight:"900",color:"#fff"},
  hSub:     {fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2},
  gemPill:  {flexDirection:"row",alignItems:"center",gap:5,backgroundColor:"rgba(245,158,11,0.15)",paddingHorizontal:12,paddingVertical:6,borderRadius:20,borderWidth:1,borderColor:"rgba(245,158,11,0.3)"},
  gemPillTxt:{fontSize:11,fontWeight:"700",color:"#F59E0B"},
  statsRow: {flexDirection:"row",gap:8,marginBottom:14},
  statCard: {flex:1,backgroundColor:"rgba(255,255,255,0.07)",borderRadius:13,paddingVertical:10,alignItems:"center",borderWidth:1,borderColor:"rgba(255,255,255,0.06)"},
  statN:    {fontSize:17,fontWeight:"900"},
  statLbl:  {fontSize:9,color:"rgba(255,255,255,0.4)",marginTop:2,fontWeight:"600"},
  tabRow:   {flexDirection:"row",gap:8},
  tab:      {flex:1,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:7,paddingVertical:10,borderRadius:14,backgroundColor:"rgba(255,255,255,0.07)",borderWidth:1,borderColor:"rgba(255,255,255,0.06)"},
  tabActive:{backgroundColor:"#fff",borderColor:"#fff"},
  tabTxt:   {fontSize:13,fontWeight:"700",color:"rgba(255,255,255,0.55)"},
  tabTxtActive:{color:"#0A1628"},

  // Input card
  inputCard:{backgroundColor:"#fff",borderRadius:20,padding:18,marginBottom:16,shadowColor:"#000",shadowOpacity:0.06,shadowRadius:10,elevation:3},
  inputHead:{flexDirection:"row",alignItems:"center",gap:8,marginBottom:16},
  inputHeadTxt:{fontSize:15,fontWeight:"800",color:"#0A1628"},
  label:    {fontSize:12,fontWeight:"700",color:"#64748B",marginBottom:7},
  input:    {backgroundColor:"#F8FAFC",borderRadius:12,paddingHorizontal:14,paddingVertical:12,fontSize:13,color:"#0A1628",borderWidth:1.5,borderColor:"#E2E8F0",fontWeight:"500"},
  errBox:   {flexDirection:"row",alignItems:"flex-start",gap:6,backgroundColor:"#FEF2F2",padding:10,borderRadius:11,marginTop:11,borderWidth:1,borderColor:"#FECACA"},
  errTxt:   {flex:1,fontSize:11,color:"#DC2626",lineHeight:16},
  analyzeBtn:{borderRadius:14,paddingVertical:15,alignItems:"center",marginTop:16},
  analyzeBtnTxt:{fontSize:14,fontWeight:"800",color:"#fff"},

  // Sections
  secRow:   {flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  secLeft:  {flexDirection:"row",alignItems:"center",gap:8},
  secBar:   {width:4,height:16,borderRadius:2,backgroundColor:"#0066CC"},
  secTitle: {fontSize:16,fontWeight:"800",color:"#0A1628"},
  resultInfo:{fontSize:10,color:"#94A3B8",fontWeight:"600",maxWidth:width*0.44,textAlign:"right"},

  // Presets
  presetChip:    {paddingHorizontal:14,paddingVertical:8,borderRadius:20,backgroundColor:"#F1F5F9",borderWidth:1.5,borderColor:"#E2E8F0"},
  presetChipActive:{backgroundColor:"#0A1628",borderColor:"#0A1628"},
  presetTxt:     {fontSize:12,fontWeight:"600",color:"#64748B"},
  presetTxtActive:{color:"#fff",fontWeight:"700"},

  // Empty state
  emptyState:  {backgroundColor:"#fff",borderRadius:20,padding:26,alignItems:"center",shadowColor:"#000",shadowOpacity:0.05,shadowRadius:8,elevation:2},
  emptyIconBox:{width:68,height:68,borderRadius:22,justifyContent:"center",alignItems:"center",marginBottom:14},
  emptyTitle:  {fontSize:16,fontWeight:"900",color:"#0A1628",marginBottom:9},
  emptySub:    {fontSize:13,color:"#64748B",textAlign:"center",lineHeight:20,marginBottom:18},
  featureRow:  {flexDirection:"row",alignItems:"center",gap:8,alignSelf:"stretch",marginBottom:6},
  featureTxt:  {fontSize:13,fontWeight:"600",color:"#475569"},
});