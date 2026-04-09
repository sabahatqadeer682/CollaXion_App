
// import { Ionicons } from "@expo/vector-icons";
// import {
//   createDrawerNavigator, DrawerContentScrollView, DrawerItemList
// } from "@react-navigation/drawer";
// import { useNavigation } from "@react-navigation/native";
// import * as ImagePicker from 'expo-image-picker';
// import React, { useState } from "react";
// import {
//   Dimensions,
//   FlatList,
//   Image,
//   KeyboardAvoidingView, Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";

// const { width } = Dimensions.get('window');

// // Define navigation types
// type DrawerParamList = {
//   Home: undefined;
//   PostInternship: undefined;
//   PostNewInternship: undefined;
//   DraftInternships: undefined;
//   ViewPostedInternships: undefined;
//   MoUs: undefined;
//   Profile: undefined;
//   ManageProjects: undefined;
//   PostNewProject: undefined;
//   DraftProjects: undefined;
//   ViewPostedProjects: undefined;
//   ProjectApplications: undefined;
//   MessagesMain: undefined;
//   ChatScreen: undefined;
//   NewMessage: undefined;
//   AIChatbot: undefined;
// };

// // --- Home Screen ---
// function HomeScreen() {
//   const navigation = useNavigation<any>();

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.openDrawer()}>
//           <Ionicons name="menu-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Industry Dashboard</Text>
//         {/* AI Icon added here */}
//         <TouchableOpacity onPress={() => navigation.navigate("AIChatbot")}>
//           <Ionicons name="sparkles-outline" size={24} color="#193648" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.cardContainer}>
//         <TouchableOpacity
//           style={styles.card}
//           activeOpacity={0.85}
//           onPress={() => navigation.navigate("PostInternship")}
//         >
//           <View style={styles.iconCircle}>
//             <Ionicons name="briefcase-outline" size={26} color="#fff" />
//           </View>
//           <Text style={styles.cardTitle}>Manage Internship</Text>
//           <Text style={styles.cardDesc}>Share internship opportunities easily.</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.card}
//           activeOpacity={0.85}
//           onPress={() => navigation.navigate("ManageProjects")}
//         >
//           <View style={[styles.iconCircle, { backgroundColor: "#193648" }]}>
//             <Ionicons name="folder-outline" size={26} color="#fff" />
//           </View>
//           <Text style={styles.cardTitle}>Manage Projects</Text>
//           <Text style={styles.cardDesc}>Collaborate on research and development projects.</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.card}
//           activeOpacity={0.85}
//           onPress={() => navigation.navigate("MoUs")}
//         >
//           <View style={[styles.iconCircle, { backgroundColor: "#193648" }]}>
//             <Ionicons name="document-text-outline" size={26} color="#fff" />
//           </View>
//           <Text style={styles.cardTitle}>View MoUs</Text>
//           <Text style={styles.cardDesc}>Check your existing collaborations.</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // --- MoUs Screen ---
// function MoUScreen() {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Your Active MoUs</Text>
//       </View>
//       <View style={styles.content}>
//         <Text style={styles.text}>List of MoUs will appear here...</Text>
//       </View>
//     </View>
//   );
// }

// // --- BEAUTIFUL POST INTERNSHIP MAIN SCREEN ---
// function PostInternship() {
//   const navigation = useNavigation();

//   const features = [
//     {
//       id: 1,
//       title: "Post New Internship",
//       description: "Create and publish new internship opportunities for students",
//       icon: "add-circle",
//       color: "#193648",
//       screen: "PostNewInternship"
//     },
//     {
//       id: 2,
//       title: "Draft Internships",
//       description: "View and manage your saved draft internships",
//       icon: "document-text",
//       color: "#193648",
//       screen: "DraftInternships"
//     },
//     {
//       id: 3,
//       title: "View Posted Internships",
//       description: "See all your active and previous internship posts",
//       icon: "list",
//       color: "#193648",
//       screen: "ViewPostedInternships"
//     }
//   ];

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Internship Management</Text>
//       </View>

//       <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
//         <View style={styles.heroSection}>
//           <View style={[styles.heroIcon, { backgroundColor: "#e8f0f5" }]}>
//             <Ionicons name="briefcase" size={40} color="#193648" />
//           </View>
//           <Text style={styles.heroTitle}>Manage Internships</Text>
//           <Text style={styles.heroSubtitle}>
//             Create, manage and track your internship opportunities in one place
//           </Text>
//         </View>

//         <View style={styles.featuresContainer}>
//           {features.map((feature) => (
//             <TouchableOpacity
//               key={feature.id}
//               style={[styles.featureCard, { borderLeftColor: feature.color }]}
//               onPress={() => navigation.navigate(feature.screen as any)}
//               activeOpacity={0.9}
//             >
//               <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
//                 <Ionicons name={feature.icon as any} size={24} color="#fff" />
//               </View>

//               <View style={styles.featureContent}>
//                 <Text style={styles.featureTitle}>{feature.title}</Text>
//                 <Text style={styles.featureDescription}>{feature.description}</Text>
//               </View>

//               <View style={styles.arrowContainer}>
//                 <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={styles.statsContainer}>
//           <Text style={styles.statsTitle}>Quick Overview</Text>
//           <View style={styles.statsGrid}>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>12</Text>
//               <Text style={styles.statLabel}>Active Posts</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>5</Text>
//               <Text style={styles.statLabel}>Drafts</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>156</Text>
//               <Text style={styles.statLabel}>Applications</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // --- Post New Internship Screen ---
// function PostNewInternshipScreen() {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Post New Internship</Text>
//       </View>

//       <ScrollView style={styles.formContainer}>
//         <Text style={styles.formSectionTitle}>Internship Details</Text>

//         <Text style={styles.label}>Internship Title *</Text>
//         <TextInput style={styles.input} placeholder="e.g., Frontend Developer Intern" />

//         <Text style={styles.label}>Company Name *</Text>
//         <TextInput style={styles.input} placeholder="Enter your company name" />

//         <Text style={styles.label}>Description *</Text>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           placeholder="Describe the internship role, responsibilities, and requirements..."
//           multiline
//           numberOfLines={6}
//         />

//         <Text style={styles.label}>Location</Text>
//         <TextInput style={styles.input} placeholder="e.g., Remote, Karachi, Lahore" />

//         <Text style={styles.label}>Stipend (per month)</Text>
//         <TextInput style={styles.input} placeholder="e.g., Rs. 25,000" keyboardType="numeric" />

//         <Text style={styles.label}>Duration</Text>
//         <TextInput style={styles.input} placeholder="e.g., 3 months, 6 months" />

//         <Text style={styles.label}>Required Skills</Text>
//         <TextInput style={styles.input} placeholder="e.g., React, JavaScript, CSS" />

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={[styles.submitButton, { backgroundColor: "#6b7280" }]}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.submitButtonText}>Cancel</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.submitButton, { backgroundColor: "#193648" }]}
//             onPress={() => {
//               alert("Internship posted successfully!");
//               navigation.navigate("PostInternship");
//             }}
//           >
//             <Text style={styles.submitButtonText}>Publish</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // --- Draft Internships Screen ---
// function DraftInternshipsScreen() {
//   const navigation = useNavigation();

//   const draftInternships = [
//     { id: 1, title: "Backend Developer Intern", company: "Tech Solutions", date: "2024-01-15" },
//     { id: 2, title: "UI/UX Designer Intern", company: "Creative Agency", date: "2024-01-10" },
//     { id: 3, title: "Data Analyst Intern", company: "Analytics Pro", date: "2024-01-05" },
//   ];

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Draft Internships</Text>
//       </View>

//       <ScrollView style={styles.listContainer}>
//         <View style={styles.listHeader}>
//           <Ionicons name="document-text-outline" size={40} color="#193648" />
//           <Text style={styles.sectionTitle}>Your Drafts ({draftInternships.length})</Text>
//           <Text style={styles.sectionSubtitle}>Continue editing your draft internships</Text>
//         </View>

//         {draftInternships.map((draft) => (
//           <View key={draft.id} style={styles.listItem}>
//             <View style={styles.listItemContent}>
//               <Text style={styles.listItemTitle}>{draft.title}</Text>
//               <Text style={styles.listItemCompany}>{draft.company}</Text>
//               <Text style={styles.listItemDate}>Created: {draft.date}</Text>
//             </View>
//             <View style={styles.listItemActions}>
//               <TouchableOpacity style={[styles.editButton, { backgroundColor: "#e8f0f5" }]}>
//                 <Ionicons name="create-outline" size={18} color="#193648" />
//                 <Text style={[styles.editButtonText, { color: "#193648" }]}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.deleteButton}>
//                 <Ionicons name="trash-outline" size={18} color="#ef4444" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}

//         <TouchableOpacity
//           style={[styles.addDraftButton, { borderColor: "#193648" }]}
//           onPress={() => navigation.navigate("PostNewInternship")}
//         >
//           <Ionicons name="add-circle-outline" size={24} color="#193648" />
//           <Text style={[styles.addDraftButtonText, { color: "#193648" }]}>Create New Draft</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }

// // --- View Posted Internships Screen ---
// function ViewPostedInternshipsScreen() {
//   const navigation = useNavigation();

//   const postedInternships = [
//     {
//       id: 1,
//       title: "Frontend Developer Intern",
//       company: "WebTech Solutions",
//       date: "2024-01-20",
//       applications: 45,
//       status: "Active"
//     },
//     {
//       id: 2,
//       title: "Mobile App Developer",
//       company: "AppInnovate",
//       date: "2024-01-18",
//       applications: 32,
//       status: "Active"
//     },
//     {
//       id: 3,
//       title: "Digital Marketing Intern",
//       company: "MarketGrow",
//       date: "2024-01-10",
//       applications: 28,
//       status: "Closed"
//     },
//   ];

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Posted Internships</Text>
//       </View>

//       <ScrollView style={styles.listContainer}>
//         <View style={styles.listHeader}>
//           <Ionicons name="list-outline" size={40} color="#193648" />
//           <Text style={styles.sectionTitle}>Your Posted Internships</Text>
//           <Text style={styles.sectionSubtitle}>Manage your active and closed internships</Text>
//         </View>

//         {postedInternships.map((internship) => (
//           <View key={internship.id} style={[
//             styles.listItem,
//             internship.status === "Closed" && styles.closedItem
//           ]}>
//             <View style={styles.listItemContent}>
//               <View style={styles.internshipHeader}>
//                 <Text style={styles.listItemTitle}>{internship.title}</Text>
//                 <View style={[
//                   styles.statusBadge,
//                   internship.status === "Active" ? [styles.activeBadge, { backgroundColor: "#e8f0f5" }] : styles.closedBadge
//                 ]}>
//                   <Text style={styles.statusText}>{internship.status}</Text>
//                 </View>
//               </View>
//               <Text style={styles.listItemCompany}>{internship.company}</Text>
//               <Text style={styles.listItemDate}>Posted: {internship.date}</Text>
//               <Text style={styles.applicationCount}>
//                 {internship.applications} Applications
//               </Text>
//             </View>
//             <View style={styles.listItemActions}>
//               <TouchableOpacity style={[styles.viewButton, { backgroundColor: "#e8f0f5" }]}>
//                 <Ionicons name="eye-outline" size={18} color="#193648" />
//                 <Text style={[styles.viewButtonText, { color: "#193648" }]}>View</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}

//         <View style={styles.statsCard}>
//           <Text style={styles.statsTitle}>Total Performance</Text>
//           <View style={styles.statsGrid}>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>3</Text>
//               <Text style={styles.statLabel}>Total Posts</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>105</Text>
//               <Text style={styles.statLabel}>Applications</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>2</Text>
//               <Text style={styles.statLabel}>Active</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // --- NEW: Manage Projects Main Screen ---
// function ManageProjects() {
//   const navigation = useNavigation();

//   const features = [
//     {
//       id: 1,
//       title: "Post New Project",
//       description: "Create and publish new research or development projects",
//       icon: "add-circle",
//       color: "#193648",
//       screen: "PostNewProject"
//     },
//     {
//       id: 2,
//       title: "Draft Projects",
//       description: "View and manage your saved draft projects",
//       icon: "document-text",
//       color: "#193648",
//       screen: "DraftProjects"
//     },
//     {
//       id: 3,
//       title: "View Posted Projects",
//       description: "See all your active and previous project posts",
//       icon: "list",
//       color: "#193648",
//       screen: "ViewPostedProjects"
//     },
//     {
//       id: 4,
//       title: "Project Applications",
//       description: "Manage student applications for your projects",
//       icon: "people",
//       color: "#193648",
//       screen: "ProjectApplications"
//     }
//   ];

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Project Management</Text>
//       </View>

//       <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
//         <View style={styles.heroSection}>
//           <View style={[styles.heroIcon, { backgroundColor: "#e8f0f5" }]}>
//             <Ionicons name="folder" size={40} color="#193648" />
//           </View>
//           <Text style={styles.heroTitle}>Manage Projects</Text>
//           <Text style={styles.heroSubtitle}>
//             Collaborate with universities on research and development projects
//           </Text>
//         </View>

//         <View style={styles.featuresContainer}>
//           {features.map((feature) => (
//             <TouchableOpacity
//               key={feature.id}
//               style={[styles.featureCard, { borderLeftColor: feature.color }]}
//               onPress={() => navigation.navigate(feature.screen as any)}
//               activeOpacity={0.9}
//             >
//               <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
//                 <Ionicons name={feature.icon as any} size={24} color="#fff" />
//               </View>

//               <View style={styles.featureContent}>
//                 <Text style={styles.featureTitle}>{feature.title}</Text>
//                 <Text style={styles.featureDescription}>{feature.description}</Text>
//               </View>

//               <View style={styles.arrowContainer}>
//                 <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={styles.statsContainer}>
//           <Text style={styles.statsTitle}>Project Overview</Text>
//           <View style={styles.statsGrid}>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>8</Text>
//               <Text style={styles.statLabel}>Active Projects</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>3</Text>
//               <Text style={styles.statLabel}>Drafts</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>89</Text>
//               <Text style={styles.statLabel}>Applications</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // --- NEW: Post New Project Screen ---
// function PostNewProjectScreen() {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Post New Project</Text>
//       </View>

//       <ScrollView style={styles.formContainer}>
//         <Text style={styles.formSectionTitle}>Project Details</Text>

//         <Text style={styles.label}>Project Title *</Text>
//         <TextInput style={styles.input} placeholder="e.g., AI-Based Healthcare Solution" />

//         <Text style={styles.label}>Project Type *</Text>
//         <TextInput style={styles.input} placeholder="e.g., Research, Development, Innovation" />

//         <Text style={styles.label}>Description *</Text>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           placeholder="Describe the project objectives, scope, and expected outcomes..."
//           multiline
//           numberOfLines={6}
//         />

//         <Text style={styles.label}>Required Skills</Text>
//         <TextInput style={styles.input} placeholder="e.g., Python, Machine Learning, Data Analysis" />

//         <Text style={styles.label}>Duration</Text>
//         <TextInput style={styles.input} placeholder="e.g., 6 months, 1 year" />

//         <Text style={styles.label}>Budget (if any)</Text>
//         <TextInput style={styles.input} placeholder="e.g., Rs. 500,000" keyboardType="numeric" />

//         <Text style={styles.label}>Expected Outcomes</Text>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           placeholder="Describe what you expect to achieve from this project..."
//           multiline
//           numberOfLines={4}
//         />

//         <Text style={styles.label}>Collaboration Requirements</Text>
//         <TextInput style={styles.input} placeholder="e.g., University researchers, Student teams" />

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={[styles.submitButton, { backgroundColor: "#6b7280" }]}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.submitButtonText}>Cancel</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.submitButton, { backgroundColor: "#193648" }]}
//             onPress={() => {
//               alert("Project posted successfully!");
//               navigation.navigate("ManageProjects");
//             }}
//           >
//             <Text style={styles.submitButtonText}>Publish Project</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // --- NEW: Draft Projects Screen ---
// function DraftProjectsScreen() {
//   const navigation = useNavigation();

//   const draftProjects = [
//     { id: 1, title: "Blockchain Supply Chain", type: "Research", date: "2024-01-18" },
//     { id: 2, title: "IoT Smart Campus", type: "Development", date: "2024-01-12" },
//     { id: 3, title: "AI Customer Support", type: "Innovation", date: "2024-01-05" },
//   ];

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Draft Projects</Text>
//       </View>

//       <ScrollView style={styles.listContainer}>
//         <View style={styles.listHeader}>
//           <Ionicons name="document-text-outline" size={40} color="#193648" />
//           <Text style={styles.sectionTitle}>Your Draft Projects ({draftProjects.length})</Text>
//           <Text style={styles.sectionSubtitle}>Continue editing your draft projects</Text>
//         </View>

//         {draftProjects.map((project) => (
//           <View key={project.id} style={styles.listItem}>
//             <View style={styles.listItemContent}>
//               <Text style={styles.listItemTitle}>{project.title}</Text>
//               <Text style={[styles.listItemCompany, { color: "#193648" }]}>{project.type}</Text>
//               <Text style={styles.listItemDate}>Created: {project.date}</Text>
//             </View>
//             <View style={styles.listItemActions}>
//               <TouchableOpacity style={[styles.editButton, { backgroundColor: "#e8f0f5" }]}>
//                 <Ionicons name="create-outline" size={18} color="#193648" />
//                 <Text style={[styles.editButtonText, { color: "#193648" }]}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.deleteButton}>
//                 <Ionicons name="trash-outline" size={18} color="#ef4444" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}

//         <TouchableOpacity
//           style={[styles.addDraftButton, { borderColor: "#193648" }]}
//           onPress={() => navigation.navigate("PostNewProject")}
//         >
//           <Ionicons name="add-circle-outline" size={24} color="#193648" />
//           <Text style={[styles.addDraftButtonText, { color: "#193648" }]}>Create New Draft</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }

// // --- NEW: View Posted Projects Screen ---
// function ViewPostedProjectsScreen() {
//   const navigation = useNavigation();

//   const postedProjects = [
//     {
//       id: 1,
//       title: "AI Healthcare Diagnostics",
//       type: "Research",
//       date: "2024-01-22",
//       applications: 23,
//       status: "Active"
//     },
//     {
//       id: 2,
//       title: "Smart City IoT Platform",
//       type: "Development",
//       date: "2024-01-15",
//       applications: 18,
//       status: "Active"
//     },
//     {
//       id: 3,
//       title: "Blockchain Voting System",
//       type: "Innovation",
//       date: "2024-01-08",
//       applications: 15,
//       status: "Completed"
//     },
//   ];

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Posted Projects</Text>
//       </View>

//       <ScrollView style={styles.listContainer}>
//         <View style={styles.listHeader}>
//           <Ionicons name="list-outline" size={40} color="#193648" />
//           <Text style={styles.sectionTitle}>Your Posted Projects</Text>
//           <Text style={styles.sectionSubtitle}>Manage your active and completed projects</Text>
//         </View>

//         {postedProjects.map((project) => (
//           <View key={project.id} style={[
//             styles.listItem,
//             project.status === "Completed" && styles.closedItem
//           ]}>
//             <View style={styles.listItemContent}>
//               <View style={styles.internshipHeader}>
//                 <Text style={styles.listItemTitle}>{project.title}</Text>
//                 <View style={[
//                   styles.statusBadge,
//                   project.status === "Active" ? [styles.activeBadge, { backgroundColor: "#e8f0f5" }] : styles.closedBadge
//                 ]}>
//                   <Text style={styles.statusText}>{project.status}</Text>
//                 </View>
//               </View>
//               <Text style={[styles.listItemCompany, { color: "#193648" }]}>{project.type}</Text>
//               <Text style={styles.listItemDate}>Posted: {project.date}</Text>
//               <Text style={styles.applicationCount}>
//                 {project.applications} Applications
//               </Text>
//             </View>
//             <View style={styles.listItemActions}>
//               <TouchableOpacity style={[styles.viewButton, { backgroundColor: "#e8f0f5" }]}>
//                 <Ionicons name="eye-outline" size={18} color="#193648" />
//                 <Text style={[styles.viewButtonText, { color: "#193648" }]}>View</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}

//         <View style={styles.statsCard}>
//           <Text style={styles.statsTitle}>Project Performance</Text>
//           <View style={styles.statsGrid}>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>3</Text>
//               <Text style={styles.statLabel}>Total Projects</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>56</Text>
//               <Text style={styles.statLabel}>Applications</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>2</Text>
//               <Text style={styles.statLabel}>Active</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // --- NEW: Project Applications Screen ---
// function ProjectApplicationsScreen() {
//   const navigation = useNavigation();

//   const applications = [
//     {
//       id: 1,
//       studentName: "Ali Ahmed",
//       project: "AI Healthcare Diagnostics",
//       date: "2024-01-25",
//       status: "Pending"
//     },
//     {
//       id: 2,
//       studentName: "Sara Khan",
//       project: "Smart City IoT Platform",
//       date: "2024-01-24",
//       status: "Shortlisted"
//     },
//     {
//       id: 3,
//       studentName: "Ahmed Raza",
//       project: "AI Healthcare Diagnostics",
//       date: "2024-01-23",
//       status: "Rejected"
//     },
//   ];

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Project Applications</Text>
//       </View>

//       <ScrollView style={styles.listContainer}>
//         <View style={styles.listHeader}>
//           <Ionicons name="people-outline" size={40} color="#193648" />
//           <Text style={styles.sectionTitle}>Project Applications</Text>
//           <Text style={styles.sectionSubtitle}>Manage student applications for your projects</Text>
//         </View>

//         {applications.map((application) => (
//           <View key={application.id} style={styles.listItem}>
//             <View style={styles.listItemContent}>
//               <Text style={styles.listItemTitle}>{application.studentName}</Text>
//               <Text style={[styles.listItemCompany, { color: "#193648" }]}>{application.project}</Text>
//               <Text style={styles.listItemDate}>Applied: {application.date}</Text>
//               <View style={[
//                 styles.statusBadge,
//                 application.status === "Pending" ? [styles.activeBadge, { backgroundColor: "#fef3c7" }] :
//                   application.status === "Shortlisted" ? [styles.activeBadge, { backgroundColor: "#e8f0f5" }] :
//                     [styles.closedBadge, { backgroundColor: "#fef2f2" }]
//               ]}>
//                 <Text style={[
//                   styles.statusText,
//                   application.status === "Pending" ? { color: "#d97706" } :
//                     application.status === "Shortlisted" ? { color: "#193648" } :
//                       { color: "#dc2626" }
//                 ]}>
//                   {application.status}
//                 </Text>
//               </View>
//             </View>
//             <View style={styles.listItemActions}>
//               <TouchableOpacity style={[styles.viewButton, { backgroundColor: "#e8f0f5" }]}>
//                 <Ionicons name="eye-outline" size={18} color="#193648" />
//                 <Text style={[styles.viewButtonText, { color: "#193648" }]}>View</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}

//         <View style={styles.statsCard}>
//           <Text style={styles.statsTitle}>Applications Summary</Text>
//           <View style={styles.statsGrid}>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>3</Text>
//               <Text style={styles.statLabel}>Total</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>1</Text>
//               <Text style={styles.statLabel}>Pending</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>1</Text>
//               <Text style={styles.statLabel}>Shortlisted</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // --- COMPLETE PROFILE MANAGEMENT SCREEN ---
// function ProfileScreen() {
//   const navigation = useNavigation();
//   const [profileData, setProfileData] = useState({
//     companyName: 'Tech Solutions Ltd',
//     industryType: 'IT & Software',
//     companySize: '51-200 employees',
//     foundedYear: '2018',
//     website: 'https://techsolutions.com',
//     email: 'contact@techsolutions.com',
//     phone: '+92 300 1234567',
//     address: '123 Main Street, Sector G',
//     city: 'Islamabad',
//     country: 'Pakistan',
//     aboutUs: 'We are a leading software development company specializing in web and mobile applications.',
//     tags: ['Web Development', 'Mobile Apps', 'AI/ML', 'Cloud Solutions'],
//     newTag: '',
//     linkedin: 'https://linkedin.com/company/tech-solutions',
//     twitter: 'https://twitter.com/techsolutions',
//     facebook: '',
//     otherSocial: '',
//     collaborationTypes: ['Internships', 'Research Projects'],
//     preferredUniversities: ['Riphah University', 'NUST']
//   });

//   const [logo, setLogo] = useState("https://via.placeholder.com/100");
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<any>({});

//   const industryTypes = ['IT & Software', 'Healthcare', 'Manufacturing', 'Education', 'Finance', 'Retail', 'Other'];
//   const companySizes = ['1-50 employees', '51-200 employees', '201-1000 employees', '1000+ employees'];
//   const countries = ['Pakistan', 'USA', 'UK', 'UAE', 'Canada', 'Australia', 'Other'];
//   const collaborationOptions = ['Internships', 'Research Projects', 'Advisory Board', 'Workshops', 'Job Placements'];
//   const universityOptions = ['Riphah University', 'NUST', 'FAST', 'LUMS', 'UET', 'Other'];

//   const handleInputChange = (field: string, value: any) => {
//     setProfileData(prev => ({
//       ...prev,
//       [field]: value
//     }));

//     if (errors[field]) {
//       setErrors((prev: any) => ({
//         ...prev,
//         [field]: ''
//       }));
//     }
//   };

//   const handleAddTag = () => {
//     if (profileData.newTag.trim() && !profileData.tags.includes(profileData.newTag.trim())) {
//       setProfileData(prev => ({
//         ...prev,
//         tags: [...prev.tags, prev.newTag.trim()],
//         newTag: ''
//       }));
//     }
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setProfileData(prev => ({
//       ...prev,
//       tags: prev.tags.filter(tag => tag !== tagToRemove)
//     }));
//   };

//   const pickImage = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Sorry, we need camera roll permissions to make this work!');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setLogo(result.assets[0].uri);
//       }
//     } catch (error) {
//       console.log('Error picking image:', error);
//     }
//   };

//   const validateForm = () => {
//     const newErrors: any = {};

//     if (!profileData.companyName.trim()) newErrors.companyName = 'Company name is required';
//     if (!profileData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(profileData.email)) newErrors.email = 'Email is invalid';
//     if (!profileData.phone.trim()) newErrors.phone = 'Phone is required';
//     if (profileData.website && !/^https?:\/\/.+/.test(profileData.website)) {
//       newErrors.website = 'Please enter a valid URL';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       alert('Profile updated successfully!');
//       navigation.goBack();
//     } catch (error) {
//       alert('Error updating profile. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Company Profile</Text>
//         <TouchableOpacity
//           onPress={handleSave}
//           disabled={isLoading}
//         >
//           <Text style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}>
//             {isLoading ? 'Saving...' : 'Save'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.profileScrollContainer} showsVerticalScrollIndicator={false}>
//         <View style={styles.profileSection}>
//           <Text style={styles.sectionTitle}>Company Information</Text>

//           <View style={styles.logoContainer}>
//             <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
//               <Image
//                 source={{ uri: logo }}
//                 style={styles.profileImage}
//               />
//               <View style={styles.cameraIcon}>
//                 <Ionicons name="camera" size={16} color="#fff" />
//               </View>
//             </TouchableOpacity>
//             <Text style={styles.uploadText}>Tap to upload logo</Text>
//           </View>

//           <View style={styles.formRow}>
//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Company Name *</Text>
//               <TextInput
//                 value={profileData.companyName}
//                 onChangeText={(value) => handleInputChange('companyName', value)}
//                 style={[styles.input, errors.companyName && styles.inputError]}
//                 placeholder="Enter company name"
//               />
//               {errors.companyName && (
//                 <Text style={styles.errorText}>{errors.companyName}</Text>
//               )}
//             </View>
//           </View>

//           <View style={styles.formRow}>
//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Industry Type</Text>
//               <View style={styles.pickerContainer}>
//                 <Text style={styles.pickerText}>
//                   {profileData.industryType || 'Select industry'}
//                 </Text>
//                 <Ionicons name="chevron-down" size={20} color="#6b7280" />
//               </View>
//             </View>

//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Company Size</Text>
//               <View style={styles.pickerContainer}>
//                 <Text style={styles.pickerText}>
//                   {profileData.companySize || 'Select size'}
//                 </Text>
//                 <Ionicons name="chevron-down" size={20} color="#6b7280" />
//               </View>
//             </View>
//           </View>

//           <View style={styles.formRow}>
//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Founded Year</Text>
//               <TextInput
//                 value={profileData.foundedYear}
//                 onChangeText={(value) => handleInputChange('foundedYear', value)}
//                 style={styles.input}
//                 placeholder="e.g., 2018"
//                 keyboardType="numeric"
//               />
//             </View>

//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Website</Text>
//               <TextInput
//                 value={profileData.website}
//                 onChangeText={(value) => handleInputChange('website', value)}
//                 style={[styles.input, errors.website && styles.inputError]}
//                 placeholder="https://example.com"
//               />
//               {errors.website && (
//                 <Text style={styles.errorText}>{errors.website}</Text>
//               )}
//             </View>
//           </View>
//         </View>

//         <View style={styles.profileSection}>
//           <Text style={styles.sectionTitle}>Contact Details</Text>

//           <View style={styles.formRow}>
//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Email Address *</Text>
//               <TextInput
//                 value={profileData.email}
//                 onChangeText={(value) => handleInputChange('email', value)}
//                 style={[styles.input, errors.email && styles.inputError]}
//                 placeholder="contact@company.com"
//                 keyboardType="email-address"
//               />
//               {errors.email && (
//                 <Text style={styles.errorText}>{errors.email}</Text>
//               )}
//             </View>

//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Phone Number *</Text>
//               <TextInput
//                 value={profileData.phone}
//                 onChangeText={(value) => handleInputChange('phone', value)}
//                 style={[styles.input, errors.phone && styles.inputError]}
//                 placeholder="+92 300 1234567"
//                 keyboardType="phone-pad"
//               />
//               {errors.phone && (
//                 <Text style={styles.errorText}>{errors.phone}</Text>
//               )}
//             </View>
//           </View>

//           <View style={styles.formRow}>
//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Address</Text>
//               <TextInput
//                 value={profileData.address}
//                 onChangeText={(value) => handleInputChange('address', value)}
//                 style={styles.input}
//                 placeholder="Street address"
//               />
//             </View>
//           </View>

//           <View style={styles.formRow}>
//             <View style={styles.formGroup}>
//               <Text style={styles.label}>City</Text>
//               <TextInput
//                 value={profileData.city}
//                 onChangeText={(value) => handleInputChange('city', value)}
//                 style={styles.input}
//                 placeholder="City"
//               />
//             </View>

//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Country</Text>
//               <View style={styles.pickerContainer}>
//                 <Text style={styles.pickerText}>
//                   {profileData.country || 'Select country'}
//                 </Text>
//                 <Ionicons name="chevron-down" size={20} color="#6b7280" />
//               </View>
//             </View>
//           </View>
//         </View>

//         <View style={styles.profileSection}>
//           <Text style={styles.sectionTitle}>Company Description</Text>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>About Us</Text>
//             <TextInput
//               value={profileData.aboutUs}
//               onChangeText={(value) => handleInputChange('aboutUs', value)}
//               style={[styles.input, styles.textArea]}
//               placeholder="Describe your company mission, values, and specializations..."
//               multiline
//               numberOfLines={4}
//               maxLength={500}
//             />
//             <Text style={styles.charCount}>
//               {profileData.aboutUs.length}/500 characters
//             </Text>
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Skills & Specializations</Text>
//             <View style={styles.tagsContainer}>
//               {profileData.tags.map((tag, index) => (
//                 <View key={index} style={styles.tag}>
//                   <Text style={styles.tagText}>{tag}</Text>
//                   <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
//                     <Ionicons name="close" size={16} color="#193648" />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//             <View style={styles.tagInputContainer}>
//               <TextInput
//                 value={profileData.newTag}
//                 onChangeText={(value) => handleInputChange('newTag', value)}
//                 style={styles.tagInput}
//                 placeholder="Add specialization (e.g., Web Development)"
//                 onSubmitEditing={handleAddTag}
//               />
//               <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
//                 <Text style={styles.addTagText}>Add</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         <View style={styles.profileSection}>
//           <Text style={styles.sectionTitle}>Social Media Links</Text>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>LinkedIn</Text>
//             <TextInput
//               value={profileData.linkedin}
//               onChangeText={(value) => handleInputChange('linkedin', value)}
//               style={styles.input}
//               placeholder="https://linkedin.com/company/..."
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Twitter</Text>
//             <TextInput
//               value={profileData.twitter}
//               onChangeText={(value) => handleInputChange('twitter', value)}
//               style={styles.input}
//               placeholder="https://twitter.com/..."
//             />
//           </View>

//           <View style={styles.formRow}>
//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Facebook</Text>
//               <TextInput
//                 value={profileData.facebook}
//                 onChangeText={(value) => handleInputChange('facebook', value)}
//                 style={styles.input}
//                 placeholder="https://facebook.com/..."
//               />
//             </View>

//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Other</Text>
//               <TextInput
//                 value={profileData.otherSocial}
//                 onChangeText={(value) => handleInputChange('otherSocial', value)}
//                 style={styles.input}
//                 placeholder="https://..."
//               />
//             </View>
//           </View>
//         </View>

//         <View style={styles.profileSection}>
//           <Text style={styles.sectionTitle}>Partnership Preferences</Text>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Preferred Collaboration Types</Text>
//             <View style={styles.checkboxContainer}>
//               {collaborationOptions.map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={styles.checkboxItem}
//                   onPress={() => {
//                     const updated = profileData.collaborationTypes.includes(option)
//                       ? profileData.collaborationTypes.filter(item => item !== option)
//                       : [...profileData.collaborationTypes, option];
//                     handleInputChange('collaborationTypes', updated);
//                   }}
//                 >
//                   <View style={[
//                     styles.checkbox,
//                     profileData.collaborationTypes.includes(option) && styles.checkboxChecked
//                   ]}>
//                     {profileData.collaborationTypes.includes(option) && (
//                       <Ionicons name="checkmark" size={16} color="#fff" />
//                     )}
//                   </View>
//                   <Text style={styles.checkboxLabel}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Preferred Universities</Text>
//             <View style={styles.checkboxContainer}>
//               {universityOptions.map(university => (
//                 <TouchableOpacity
//                   key={university}
//                   style={styles.checkboxItem}
//                   onPress={() => {
//                     const updated = profileData.preferredUniversities.includes(university)
//                       ? profileData.preferredUniversities.filter(item => item !== university)
//                       : [...profileData.preferredUniversities, university];
//                     handleInputChange('preferredUniversities', updated);
//                   }}
//                 >
//                   <View style={[
//                     styles.checkbox,
//                     profileData.preferredUniversities.includes(university) && styles.checkboxChecked
//                   ]}>
//                     {profileData.preferredUniversities.includes(university) && (
//                       <Ionicons name="checkmark" size={16} color="#fff" />
//                     )}
//                   </View>
//                   <Text style={styles.checkboxLabel}>{university}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         </View>

//         <View style={styles.profileSection}>
//           <TouchableOpacity
//             onPress={handleSave}
//             disabled={isLoading}
//             style={[styles.saveAllButton, isLoading && styles.saveAllButtonDisabled]}
//           >
//             <Text style={styles.saveAllButtonText}>
//               {isLoading ? 'Saving Changes...' : 'Save All Changes'}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.deleteButton}>
//             <Text style={styles.deleteButtonText}>Delete Account</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.bottomSpace} />
//       </ScrollView>
//     </View>
//   );
// }

// // --- Messages Main Screen ---
// function MessagesScreen() {
//   const navigation = useNavigation();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("all");

//   const [conversations, setConversations] = useState([
//     {
//       id: 1,
//       name: "Ali Ahmed",
//       type: "student",
//       avatar: "https://via.placeholder.com/60",
//       lastMessage: "Thank you for considering my application!",
//       timestamp: "10:30 AM",
//       unread: 2,
//       isOnline: true
//     },
//     {
//       id: 2,
//       name: "Riphah University",
//       type: "university",
//       avatar: "https://via.placeholder.com/60/193648/ffffff?text=R",
//       lastMessage: "Meeting scheduled for next week",
//       timestamp: "Yesterday",
//       unread: 0,
//       isOnline: false
//     },
//     {
//       id: 3,
//       name: "Sara Khan",
//       type: "student",
//       avatar: "https://via.placeholder.com/60",
//       lastMessage: "When can I expect feedback on my project?",
//       timestamp: "Yesterday",
//       unread: 1,
//       isOnline: true
//     }
//   ]);

//   const filteredConversations = conversations.filter(conv => {
//     const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

//     if (activeTab === "all") return matchesSearch;
//     if (activeTab === "students") return matchesSearch && conv.type === "student";
//     if (activeTab === "universities") return matchesSearch && conv.type === "university";

//     return matchesSearch;
//   });

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Messages</Text>
//         <TouchableOpacity>
//           <Ionicons name="filter-outline" size={24} color="#193648" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.searchContainer}>
//         <View style={styles.searchInputContainer}>
//           <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search messages or people..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery("")}>
//               <Ionicons name="close-circle" size={20} color="#6b7280" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === "all" && styles.activeTab]}
//           onPress={() => setActiveTab("all")}
//         >
//           <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
//             All Chats
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.tab, activeTab === "students" && styles.activeTab]}
//           onPress={() => setActiveTab("students")}
//         >
//           <Text style={[styles.tabText, activeTab === "students" && styles.activeTabText]}>
//             Students
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.tab, activeTab === "universities" && styles.activeTab]}
//           onPress={() => setActiveTab("universities")}
//         >
//           <Text style={[styles.tabText, activeTab === "universities" && styles.activeTabText]}>
//             Universities
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={filteredConversations}
//         keyExtractor={(item) => item.id.toString()}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContainer}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.conversationItem}
//             onPress={() => navigation.navigate("ChatScreen", { conversation: item })}
//           >
//             <View style={styles.avatarContainer}>
//               <Image source={{ uri: item.avatar }} style={styles.avatar} />
//               {item.isOnline && <View style={styles.onlineIndicator} />}
//             </View>

//             <View style={styles.conversationContent}>
//               <View style={styles.conversationHeader}>
//                 <Text style={styles.conversationName}>{item.name}</Text>
//                 <Text style={styles.timestamp}>{item.timestamp}</Text>
//               </View>

//               <View style={styles.conversationFooter}>
//                 <View style={styles.messageInfo}>
//                   <Ionicons
//                     name={item.type === "student" ? "person" : "business"}
//                     size={14}
//                     color="#6b7280"
//                     style={styles.typeIcon}
//                   />
//                   <Text style={styles.lastMessage} numberOfLines={1}>
//                     {item.lastMessage}
//                   </Text>
//                 </View>

//                 {item.unread > 0 && (
//                   <View style={styles.unreadBadge}>
//                     <Text style={styles.unreadText}>{item.unread}</Text>
//                   </View>
//                 )}
//               </View>
//             </View>
//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="chatbubble-ellipses-outline" size={80} color="#d1d5db" />
//             <Text style={styles.emptyTitle}>No conversations</Text>
//             <Text style={styles.emptySubtitle}>
//               {activeTab === "all"
//                 ? "Start a conversation with students or universities"
//                 : `No ${activeTab} conversations found`}
//             </Text>
//           </View>
//         }
//       />

//       <TouchableOpacity
//         style={styles.newMessageButton}
//         onPress={() => navigation.navigate("NewMessage")}
//       >
//         <Ionicons name="add" size={24} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// // --- Individual Chat Screen ---
// function ChatScreen({ route }: any) {
//   const navigation = useNavigation();
//   const { conversation } = route.params;
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm interested in the Frontend Developer internship.",
//       sender: "them",
//       timestamp: new Date(Date.now() - 3600000),
//       read: true
//     },
//     {
//       id: 2,
//       text: "Hi Ali! Thanks for your interest. Can you tell me more about your experience with React?",
//       sender: "me",
//       timestamp: new Date(Date.now() - 3500000),
//       read: true
//     },
//     {
//       id: 3,
//       text: "I have 2 years of experience with React and have built several projects including a task management app and e-commerce website.",
//       sender: "them",
//       timestamp: new Date(Date.now() - 3400000),
//       read: true
//     }
//   ]);

//   const sendMessage = () => {
//     if (message.trim().length === 0) return;

//     const newMessage = {
//       id: messages.length + 1,
//       text: message,
//       sender: "me",
//       timestamp: new Date(),
//       read: false
//     };

//     setMessages([...messages, newMessage]);
//     setMessage("");
//   };

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.screenContainer}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <View style={styles.chatHeader}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={24} color="#193648" />
//         </TouchableOpacity>

//         <View style={styles.chatHeaderInfo}>
//           <Image source={{ uri: conversation.avatar }} style={styles.chatAvatar} />
//           <View style={styles.chatHeaderText}>
//             <Text style={styles.chatName}>{conversation.name}</Text>
//             <Text style={styles.chatStatus}>
//               {conversation.isOnline ? "Online" : "Offline"}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.headerActions}>
//           <TouchableOpacity style={styles.headerAction}>
//             <Ionicons name="call-outline" size={20} color="#193648" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.headerAction}>
//             <Ionicons name="videocam-outline" size={20} color="#193648" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.headerAction}>
//             <Ionicons name="information-circle-outline" size={20} color="#193648" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id.toString()}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.messagesContainer}
//         inverted={false}
//         renderItem={({ item }) => (
//           <View style={[
//             styles.messageBubble,
//             item.sender === "me" ? styles.myMessage : styles.theirMessage
//           ]}>
//             <Text style={[
//               styles.messageText,
//               item.sender === "me" ? styles.myMessageText : styles.theirMessageText
//             ]}>
//               {item.text}
//             </Text>
//             <Text style={styles.messageTime}>
//               {formatTime(item.timestamp)}
//             </Text>
//           </View>
//         )}
//       />

//       <View style={styles.inputContainer}>
//         <TouchableOpacity style={styles.attachmentButton}>
//           <Ionicons name="attach" size={24} color="#6b7280" />
//         </TouchableOpacity>

//         <TextInput
//           style={styles.messageInput}
//           placeholder="Type a message..."
//           value={message}
//           onChangeText={setMessage}
//           multiline
//           maxLength={500}
//         />

//         <TouchableOpacity
//           style={[styles.sendButton, !message && styles.sendButtonDisabled]}
//           onPress={sendMessage}
//           disabled={!message}
//         >
//           <Ionicons
//             name="send"
//             size={20}
//             color={message ? "#fff" : "#9ca3af"}
//           />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // --- New Message Screen ---
// function NewMessageScreen() {
//   const navigation = useNavigation();
//   const [searchQuery, setSearchQuery] = useState("");

//   const [users, setUsers] = useState([
//     {
//       id: 1,
//       name: "Ali Ahmed",
//       type: "student",
//       avatar: "https://via.placeholder.com/60",
//       status: "Computer Science Student",
//       isOnline: true
//     },
//     {
//       id: 2,
//       name: "Sara Khan",
//       type: "student",
//       avatar: "https://via.placeholder.com/60",
//       status: "Software Engineering",
//       isOnline: false
//     },
//     {
//       id: 3,
//       name: "Riphah University",
//       type: "university",
//       avatar: "https://via.placeholder.com/60/193648/ffffff?text=R",
//       status: "Collaboration Partner",
//       isOnline: true
//     }
//   ]);

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.status.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>New Message</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <View style={styles.searchContainer}>
//         <View style={styles.searchInputContainer}>
//           <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search students or universities..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>
//       </View>

//       <FlatList
//         data={filteredUsers}
//         keyExtractor={(item) => item.id.toString()}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContainer}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.userItem}
//             onPress={() => navigation.navigate("ChatScreen", {
//               conversation: {
//                 ...item,
//                 lastMessage: "",
//                 timestamp: "Now",
//                 unread: 0
//               }
//             })}
//           >
//             <View style={styles.avatarContainer}>
//               <Image source={{ uri: item.avatar }} style={styles.avatar} />
//               {item.isOnline && <View style={styles.onlineIndicator} />}
//             </View>

//             <View style={styles.userContent}>
//               <Text style={styles.userName}>{item.name}</Text>
//               <Text style={styles.userStatus}>{item.status}</Text>
//             </View>

//             <View style={styles.userType}>
//               <Ionicons
//                 name={item.type === "student" ? "person" : "business"}
//                 size={16}
//                 color="#6b7280"
//               />
//               <Text style={styles.userTypeText}>
//                 {item.type === "student" ? "Student" : "University"}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="search-outline" size={80} color="#d1d5db" />
//             <Text style={styles.emptyTitle}>No users found</Text>
//             <Text style={styles.emptySubtitle}>
//               Try searching with different keywords
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// // --- AI Chatbot Screen ---
// function AIChatbotScreen() {
//   const navigation = useNavigation();
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm your AI Assistant. I can help you with internship management, project collaboration, MoU tracking, and more. How can I assist you today?",
//       sender: "ai",
//       timestamp: new Date(),
//     }
//   ]);
//   const [isTyping, setIsTyping] = useState(false);

//   const aiResponses = [
//     "I can help you create a new internship posting. What position are you looking to fill?",
//     "For project collaborations, I recommend connecting with universities that have relevant research departments.",
//     "I can check your MoU status and send renewal reminders. Would you like me to do that?",
//     "You have 3 active internships and 2 ongoing projects. Would you like detailed reports?",
//     "I can help you analyze applicant data to find the best candidates for your opportunities.",
//     "For better collaboration, consider scheduling advisory board meetings with your partner universities.",
//     "I notice you have some draft internships. Would you like to complete and publish them?",
//     "Let me help you optimize your company profile to attract more students and universities."
//   ];

//   const sendMessage = () => {
//     if (message.trim().length === 0) return;

//     const userMessage = {
//       id: messages.length + 1,
//       text: message,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setMessage("");
//     setIsTyping(true);

//     setTimeout(() => {
//       const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
//       const aiMessage = {
//         id: messages.length + 2,
//         text: randomResponse,
//         sender: "ai",
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, aiMessage]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   const quickActions = [
//     { icon: "briefcase-outline", text: "Post Internship", action: "post_internship" },
//     { icon: "folder-outline", text: "Create Project", action: "create_project" },
//     { icon: "document-text-outline", text: "Check MoUs", action: "check_mous" },
//     { icon: "analytics-outline", text: "View Reports", action: "view_reports" },
//   ];

//   const handleQuickAction = (action: string) => {
//     let actionText = "";
//     switch (action) {
//       case "post_internship":
//         actionText = "I want to post a new internship. Can you guide me?";
//         break;
//       case "create_project":
//         actionText = "Help me create a new collaboration project.";
//         break;
//       case "check_mous":
//         actionText = "Show me my current MoU status and renewals.";
//         break;
//       case "view_reports":
//         actionText = "I want to see analytics and performance reports.";
//         break;
//     }
//     setMessage(actionText);
//   };

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={28} color="#193648" />
//         </TouchableOpacity>
//         <View style={styles.aiHeaderInfo}>
//           <View style={styles.aiAvatar}>
//             <Ionicons name="sparkles" size={24} color="#193648" />
//           </View>
//           <View>
//             <Text style={styles.headerTitle}>AI Assistant</Text>
//             <Text style={styles.aiStatus}>
//               {isTyping ? "Typing..." : "Online"}
//             </Text>
//           </View>
//         </View>
//         <TouchableOpacity>
//           <Ionicons name="ellipsis-vertical" size={20} color="#193648" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.quickActionsContainer}
//         contentContainerStyle={styles.quickActionsContent}
//       >
//         {quickActions.map((action, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.quickAction}
//             onPress={() => handleQuickAction(action.action)}
//           >
//             <View style={styles.quickActionIcon}>
//               <Ionicons name={action.icon as any} size={20} color="#193648" />
//             </View>
//             <Text style={styles.quickActionText}>{action.text}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id.toString()}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.aiMessagesContainer}
//         inverted={false}
//         renderItem={({ item }) => (
//           <View style={[
//             styles.aiMessageBubble,
//             item.sender === "user" ? styles.aiMyMessage : styles.aiTheirMessage
//           ]}>
//             {item.sender === "ai" && (
//               <View style={styles.aiMessageAvatar}>
//                 <Ionicons name="sparkles" size={16} color="#193648" />
//               </View>
//             )}
//             <View style={styles.aiMessageContent}>
//               <Text style={[
//                 styles.aiMessageText,
//                 item.sender === "user" ? styles.aiMyMessageText : styles.aiTheirMessageText
//               ]}>
//                 {item.text}
//               </Text>
//               <Text style={styles.aiMessageTime}>
//                 {formatTime(item.timestamp)}
//               </Text>
//             </View>
//             {item.sender === "user" && (
//               <View style={styles.aiMessageAvatar}>
//                 <Ionicons name="person" size={16} color="#193648" />
//               </View>
//             )}
//           </View>
//         )}
//         ListFooterComponent={
//           isTyping && (
//             <View style={[styles.aiMessageBubble, styles.aiTheirMessage]}>
//               <View style={styles.aiMessageAvatar}>
//                 <Ionicons name="sparkles" size={16} color="#193648" />
//               </View>
//               <View style={styles.aiMessageContent}>
//                 <View style={styles.typingIndicator}>
//                   <View style={styles.typingDot} />
//                   <View style={styles.typingDot} />
//                   <View style={styles.typingDot} />
//                 </View>
//               </View>
//             </View>
//           )
//         }
//       />

//       <View style={styles.aiInputContainer}>
//         <TouchableOpacity style={styles.aiAttachmentButton}>
//           <Ionicons name="add-circle-outline" size={24} color="#6b7280" />
//         </TouchableOpacity>

//         <TextInput
//           style={styles.aiMessageInput}
//           placeholder="Ask me anything about internships, projects, or collaborations..."
//           value={message}
//           onChangeText={setMessage}
//           multiline
//           maxLength={500}
//         />

//         <TouchableOpacity
//           style={[styles.aiSendButton, !message && styles.aiSendButtonDisabled]}
//           onPress={sendMessage}
//           disabled={!message}
//         >
//           <Ionicons
//             name="send"
//             size={20}
//             color={message ? "#fff" : "#9ca3af"}
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // --- UPDATED CUSTOM DRAWER CONTENT WITH PROFILE PICTURE ---
// function CustomDrawerContent(props: any) {
//   const [profileImage, setProfileImage] = useState("https://via.placeholder.com/100");
//   const [companyName, setCompanyName] = useState("Tech Solutions Ltd.");
//   const [isActive, setIsActive] = useState(true);

//   const pickImage = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Sorry, we need camera roll permissions to make this work!');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setProfileImage(result.assets[0].uri);
//       }
//     } catch (error) {
//       console.log('Error picking image:', error);
//     }
//   };

//   const toggleStatus = () => {
//     setIsActive(!isActive);
//   };

//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={styles.drawerHeader}>
//         <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
//           <Image
//             source={{ uri: profileImage }}
//             style={styles.profileImage}
//           />
//           <View style={styles.cameraIcon}>
//             <Ionicons name="camera" size={16} color="#fff" />
//           </View>
//         </TouchableOpacity>

//         <Text style={styles.companyName}>{companyName}</Text>

//         <View style={styles.statusContainer}>
//           <TouchableOpacity
//             style={[styles.statusButton, isActive ? [styles.activeStatus, { backgroundColor: "#e8f0f5" }] : styles.inactiveStatus]}
//             onPress={toggleStatus}
//           >
//             <View style={[styles.statusDot, isActive ? [styles.activeDot, { backgroundColor: "#193648" }] : styles.inactiveDot]} />
//             <Text style={[styles.statusText, isActive ? [styles.activeStatusText, { color: "#193648" }] : styles.inactiveStatusText]}>
//               {isActive ? 'Active' : 'Inactive'}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.companyInfo}>
//           <View style={styles.infoItem}>
//             <Ionicons name="business" size={16} color="#6b7280" />
//             <Text style={styles.infoText}>Technology</Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Ionicons name="location" size={16} color="#6b7280" />
//             <Text style={styles.infoText}>Karachi, Pakistan</Text>
//           </View>
//         </View>
//       </View>

//       <DrawerItemList {...props} />

//       <TouchableOpacity style={styles.logoutButton} onPress={() => props.navigation.navigate("IndustryLogin")}>
//         <Ionicons name="log-out-outline" size={20} color="#ef4444" />
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </DrawerContentScrollView>
//   );
// }

// const Drawer = createDrawerNavigator<DrawerParamList>();

// // --- Main App Component ---
// export default function IndustryDashboard() {
//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         headerShown: false,
//         drawerActiveTintColor: "#193648",
//         drawerInactiveTintColor: "#333",
//         drawerLabelStyle: { marginLeft: -10, fontSize: 16 },
//       }}
//     >
//       <Drawer.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="PostInternship"
//         component={PostInternship}
//         options={{
//           drawerLabel: "Internship Management",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="briefcase-outline" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="ManageProjects"
//         component={ManageProjects}
//         options={{
//           drawerLabel: "Project Management",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="folder-outline" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="MoUs"
//         component={MoUScreen}
//         options={{
//           drawerLabel: "View MoUs",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="document-text-outline" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="MessagesMain"
//         component={MessagesScreen}
//         options={{
//           drawerLabel: "Chat (Messages)",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="chatbubble-outline" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="AIChatbot"
//         component={AIChatbotScreen}
//         options={{
//           drawerLabel: "AI Assistant",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="sparkles-outline" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           drawerLabel: "My Profile",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="person-outline" size={22} color={color} />
//           ),
//         }}
//       />

//       {/* Hidden Screens */}
//       <Drawer.Screen
//         name="PostNewInternship"
//         component={PostNewInternshipScreen}
//         options={{
//           drawerLabel: "Post New Internship",
//           drawerItemStyle: { display: 'none' }
//         }}
//       />
//       <Drawer.Screen
//         name="DraftInternships"
//         component={DraftInternshipsScreen}
//         options={{
//           drawerLabel: "Draft Internships",
//           drawerItemStyle: { display: 'none' }
//         }}
//       />
//       <Drawer.Screen
//         name="ViewPostedInternships"
//         component={ViewPostedInternshipsScreen}
//         options={{
//           drawerLabel: "Posted Internships",
//           drawerItemStyle: { display: 'none' }
//         }}
//       />
//       <Drawer.Screen
//         name="PostNewProject"
//         component={PostNewProjectScreen}
//         options={{
//           drawerLabel: "Post New Project",
//           drawerItemStyle: { display: 'none' }
//         }}
//       />
//       <Drawer.Screen
//         name="DraftProjects"
//         component={DraftProjectsScreen}
//         options={{
//           drawerLabel: "Draft Projects",
//           drawerItemStyle: { display: 'none' }
//         }}
//       />
//       <Drawer.Screen
//         name="ViewPostedProjects"
//         component={ViewPostedProjectsScreen}
//         options={{
//           drawerLabel: "Posted Projects",
//           drawerItemStyle: { display: 'none' }
//         }}
//       />
//       <Drawer.Screen
//         name="ProjectApplications"
//         component={ProjectApplicationsScreen}
//         options={{
//           drawerLabel: "Project Applications",
//           drawerItemStyle: { display: 'none' }
//         }}
//       />
//       <Drawer.Screen
//         name="ChatScreen"
//         component={ChatScreen}
//         options={{
//           drawerLabel: "Chat",
//           drawerItemStyle: { display: 'none' }
//         }}
//       />
//       <Drawer.Screen
//         name="NewMessage"
//         component={NewMessageScreen}
//         options={{
//           drawerLabel: "New Message",
//           drawerItemStyle: { display: 'none' }
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   screenContainer: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 50,
//     paddingBottom: 16,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#193648",
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   heroSection: {
//     backgroundColor: "#fff",
//     padding: 24,
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e7eb",
//   },
//   heroIcon: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#e8f0f5",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   heroTitle: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#193648",
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   heroSubtitle: {
//     fontSize: 16,
//     color: "#6b7280",
//     textAlign: "center",
//     lineHeight: 22,
//   },
//   featuresContainer: {
//     padding: 16,
//   },
//   featureCard: {
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderLeftWidth: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   featureIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//   },
//   featureContent: {
//     flex: 1,
//   },
//   featureTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#193648",
//     marginBottom: 4,
//   },
//   featureDescription: {
//     fontSize: 14,
//     color: "#6b7280",
//     lineHeight: 18,
//   },
//   arrowContainer: {
//     marginLeft: 8,
//   },
//   statsContainer: {
//     backgroundColor: "#fff",
//     margin: 16,
//     padding: 20,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   statsTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#193648",
//     marginBottom: 16,
//   },
//   statsGrid: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   statItem: {
//     alignItems: "center",
//     flex: 1,
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#193648",
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: "#6b7280",
//     textAlign: "center",
//   },
//   formContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   formSectionTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#193648",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#193648",
//     marginTop: 12,
//     marginBottom: 4,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     padding: 12,
//     borderRadius: 8,
//     fontSize: 16,
//     backgroundColor: "#fff",
//   },
//   textArea: {
//     height: 120,
//     textAlignVertical: "top",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//     gap: 10,
//   },
//   submitButton: {
//     backgroundColor: "#193648",
//     padding: 16,
//     borderRadius: 8,
//     alignItems: "center",
//     flex: 1,
//   },
//   submitButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   listContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   listHeader: {
//     alignItems: "center",
//     marginBottom: 20,
//     padding: 20,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: "600",
//     color: "#193648",
//     marginTop: 10,
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     color: "#6b7280",
//     textAlign: "center",
//     marginTop: 5,
//   },
//   listItem: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   closedItem: {
//     opacity: 0.7,
//     backgroundColor: "#f9fafb",
//   },
//   listItemContent: {
//     flex: 1,
//   },
//   internshipHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 4,
//   },
//   listItemTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#193648",
//     flex: 1,
//   },
//   listItemCompany: {
//     fontSize: 14,
//     color: "#6b7280",
//     marginBottom: 2,
//   },
//   listItemDate: {
//     fontSize: 12,
//     color: "#9ca3af",
//     marginBottom: 4,
//   },
//   applicationCount: {
//     fontSize: 12,
//     color: "#193648",
//     fontWeight: "600",
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 8,
//   },
//   activeBadge: {
//     backgroundColor: "#e8f0f5",
//   },
//   closedBadge: {
//     backgroundColor: "#f3f4f6",
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: "600",
//     color: "#193648",
//   },
//   listItemActions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   editButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 6,
//     backgroundColor: "#e8f0f5",
//     borderRadius: 6,
//     gap: 4,
//   },
//   editButtonText: {
//     fontSize: 12,
//     color: "#193648",
//     fontWeight: "500",
//   },
//   viewButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 6,
//     backgroundColor: "#e8f0f5",
//     borderRadius: 6,
//     gap: 4,
//   },
//   viewButtonText: {
//     fontSize: 12,
//     color: "#193648",
//     fontWeight: "500",
//   },
//   deleteButton: {
//     padding: 6,
//     backgroundColor: "#fef2f2",
//     borderRadius: 6,
//   },
//   addDraftButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginTop: 10,
//     gap: 8,
//     borderWidth: 2,
//     borderColor: "#193648",
//     borderStyle: "dashed",
//   },
//   addDraftButtonText: {
//     fontSize: 16,
//     color: "#193648",
//     fontWeight: "600",
//   },
//   statsCard: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 12,
//     marginTop: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   drawerHeader: {
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//     alignItems: "center",
//   },
//   profileImageContainer: {
//     position: 'relative',
//     marginBottom: 12,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   cameraIcon: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#193648',
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   companyName: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#193648",
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   statusContainer: {
//     marginBottom: 12,
//   },
//   statusButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 6,
//   },
//   activeStatus: {
//     backgroundColor: '#e8f0f5',
//   },
//   inactiveStatus: {
//     backgroundColor: '#f3f4f6',
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   activeDot: {
//     backgroundColor: '#193648',
//   },
//   inactiveDot: {
//     backgroundColor: '#6b7280',
//   },
//   activeStatusText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: '#193648',
//   },
//   inactiveStatusText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: '#6b7280',
//   },
//   companyInfo: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 16,
//     marginTop: 8,
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   infoText: {
//     fontSize: 12,
//     color: "#6b7280",
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     margin: 16,
//     marginTop: 20,
//     backgroundColor: '#fef2f2',
//     borderRadius: 8,
//     gap: 12,
//   },
//   logoutText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: '#ef4444',
//   },
//   cardContainer: {
//     flex: 1,
//     padding: 16,
//     justifyContent: "center",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 24,
//     borderRadius: 12,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     alignItems: "center",
//   },
//   iconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#193648",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#193648",
//     marginBottom: 8,
//   },
//   cardDesc: {
//     fontSize: 14,
//     color: "#6b7280",
//     textAlign: "center",
//   },
//   content: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   text: {
//     fontSize: 16,
//     color: "#6b7280",
//     textAlign: "center",
//     marginTop: 8,
//   },
//   profileScrollContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   profileSection: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#193648',
//     marginBottom: 16,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   uploadText: {
//     fontSize: 12,
//     color: '#6b7280',
//     marginTop: 8,
//   },
//   formRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 12,
//   },
//   formGroup: {
//     flex: 1,
//   },
//   inputError: {
//     borderColor: '#ef4444',
//   },
//   errorText: {
//     color: '#ef4444',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   pickerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   pickerText: {
//     fontSize: 16,
//     color: '#193648',
//   },
//   charCount: {
//     fontSize: 12,
//     color: '#6b7280',
//     textAlign: 'right',
//     marginTop: 4,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 12,
//   },
//   tag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#e8f0f5',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     gap: 6,
//   },
//   tagText: {
//     fontSize: 14,
//     color: '#193648',
//   },
//   tagInputContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   tagInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     padding: 12,
//     borderRadius: 8,
//     fontSize: 16,
//     backgroundColor: '#fff',
//   },
//   addTagButton: {
//     backgroundColor: '#193648',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 8,
//     justifyContent: 'center',
//   },
//   addTagText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   checkboxContainer: {
//     gap: 12,
//   },
//   checkboxItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     borderWidth: 2,
//     borderColor: '#d1d5db',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxChecked: {
//     backgroundColor: '#193648',
//     borderColor: '#193648',
//   },
//   checkboxLabel: {
//     fontSize: 16,
//     color: '#193648',
//   },
//   saveButton: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#193648',
//   },
//   saveButtonDisabled: {
//     opacity: 0.5,
//   },
//   saveAllButton: {
//     backgroundColor: '#193648',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   saveAllButtonDisabled: {
//     opacity: 0.5,
//   },
//   saveAllButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cancelButton: {
//     backgroundColor: '#f3f4f6',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   cancelButtonText: {
//     color: '#374151',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   deleteButton: {
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ef4444',
//   },
//   deleteButtonText: {
//     color: '#ef4444',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   bottomSpace: {
//     height: 20,
//   },
//   // Messages Styles
//   searchContainer: {
//     padding: 16,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e7eb",
//   },
//   searchInputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f3f4f6",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: "#193648",
//   },
//   tabContainer: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e7eb",
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: "center",
//     borderBottomWidth: 2,
//     borderBottomColor: "transparent",
//   },
//   activeTab: {
//     borderBottomColor: "#193648",
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6b7280",
//   },
//   activeTabText: {
//     color: "#193648",
//     fontWeight: "600",
//   },
//   conversationItem: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   avatarContainer: {
//     position: "relative",
//     marginRight: 12,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   onlineIndicator: {
//     position: "absolute",
//     bottom: 2,
//     right: 2,
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "#10b981",
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   conversationContent: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   conversationHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 4,
//   },
//   conversationName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#193648",
//     flex: 1,
//   },
//   timestamp: {
//     fontSize: 12,
//     color: "#6b7280",
//   },
//   conversationFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   messageInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   typeIcon: {
//     marginRight: 6,
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: "#6b7280",
//     flex: 1,
//   },
//   unreadBadge: {
//     backgroundColor: "#193648",
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 8,
//   },
//   unreadText: {
//     color: "#fff",
//     fontSize: 10,
//     fontWeight: "600",
//   },
//   emptyContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 60,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#6b7280",
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: "#9ca3af",
//     textAlign: "center",
//     lineHeight: 20,
//   },
//   newMessageButton: {
//     position: "absolute",
//     bottom: 24,
//     right: 24,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#193648",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   chatHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 50,
//     paddingBottom: 16,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   chatHeaderInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     marginLeft: 12,
//   },
//   chatAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   chatHeaderText: {
//     flex: 1,
//   },
//   chatName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#193648",
//   },
//   chatStatus: {
//     fontSize: 12,
//     color: "#10b981",
//   },
//   headerActions: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerAction: {
//     padding: 8,
//     marginLeft: 8,
//   },
//   messagesContainer: {
//     padding: 16,
//     paddingBottom: 8,
//   },
//   messageBubble: {
//     maxWidth: "80%",
//     padding: 12,
//     borderRadius: 16,
//     marginBottom: 8,
//   },
//   myMessage: {
//     alignSelf: "flex-end",
//     backgroundColor: "#193648",
//     borderBottomRightRadius: 4,
//   },
//   theirMessage: {
//     alignSelf: "flex-start",
//     backgroundColor: "#e8f0f5",
//     borderBottomLeftRadius: 4,
//   },
//   messageText: {
//     fontSize: 16,
//     lineHeight: 20,
//   },
//   myMessageText: {
//     color: "#fff",
//   },
//   theirMessageText: {
//     color: "#193648",
//   },
//   messageTime: {
//     fontSize: 10,
//     marginTop: 4,
//     opacity: 0.7,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     padding: 16,
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderTopColor: "#e5e7eb",
//   },
//   attachmentButton: {
//     padding: 8,
//     marginRight: 8,
//   },
//   messageInput: {
//     flex: 1,
//     backgroundColor: "#f3f4f6",
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     maxHeight: 100,
//     fontSize: 16,
//     color: "#193648",
//   },
//   sendButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#193648",
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 8,
//   },
//   sendButtonDisabled: {
//     backgroundColor: "#f3f4f6",
//   },
//   userItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   userContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#193648",
//     marginBottom: 2,
//   },
//   userStatus: {
//     fontSize: 14,
//     color: "#6b7280",
//   },
//   userType: {
//     alignItems: "center",
//   },
//   userTypeText: {
//     fontSize: 10,
//     color: "#6b7280",
//     marginTop: 2,
//   },
//   // AI Chatbot Styles
//   aiHeaderInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     marginLeft: 16,
//   },
//   aiAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#e8f0f5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   aiStatus: {
//     fontSize: 12,
//     color: '#10b981',
//   },
//   quickActionsContainer: {
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   quickActionsContent: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     gap: 12,
//   },
//   quickAction: {
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     minWidth: 100,
//   },
//   quickActionIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#e8f0f5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   quickActionText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#193648',
//     textAlign: 'center',
//   },
//   aiMessagesContainer: {
//     padding: 16,
//     paddingBottom: 8,
//   },
//   aiMessageBubble: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     marginBottom: 12,
//     maxWidth: '100%',
//   },
//   aiMyMessage: {
//     justifyContent: 'flex-end',
//   },
//   aiTheirMessage: {
//     justifyContent: 'flex-start',
//   },
//   aiMessageAvatar: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: '#e8f0f5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },
//   aiMessageContent: {
//     maxWidth: '80%',
//     padding: 12,
//     borderRadius: 16,
//   },
//   aiMyMessageText: {
//     color: '#fff',
//   },
//   aiTheirMessageText: {
//     color: '#193648',
//   },
//   aiMessageTime: {
//     fontSize: 10,
//     marginTop: 4,
//     opacity: 0.7,
//   },
//   typingIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   typingDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#193648',
//     marginHorizontal: 2,
//     opacity: 0.6,
//   },
//   aiInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//   },
//   aiAttachmentButton: {
//     padding: 8,
//     marginRight: 8,
//   },
//   aiMessageInput: {
//     flex: 1,
//     backgroundColor: '#f3f4f6',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     maxHeight: 100,
//     fontSize: 16,
//     color: '#193648',
//   },
//   aiSendButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#193648',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   aiSendButtonDisabled: {
//     backgroundColor: '#f3f4f6',
//   },
// });










// import { Ionicons } from "@expo/vector-icons";
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList
// } from "@react-navigation/drawer";
// import { useNavigation } from "@react-navigation/native";
// import React, { createContext, useContext, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";

// const { width } = Dimensions.get('window');

// // --- THEME & CONSTANTS ---
// const COLORS = {
//   primary: "#193648",
//   secondary: "#2C5364",
//   accent: "#e8f0f5",
//   background: "#F5F7FA",
//   white: "#FFFFFF",
//   text: "#1F2937",
//   textLight: "#6B7280",
//   success: "#10B981",
//   warning: "#F59E0B",
//   danger: "#EF4444",
//   border: "#E5E7EB"
// };

// // --- DATA CONTEXT (The Logic Engine) ---
// // This allows data to be shared across all screens
// const DashboardContext = createContext<any>(null);

// const DashboardProvider = ({ children }: any) => {
//   // Mock Data State
//   const [internships, setInternships] = useState([
//     { id: 1, title: "Frontend Developer Intern", company: "Tech Solutions", date: "2024-01-20", applications: 45, status: "Active" },
//     { id: 2, title: "Mobile App Developer", company: "Tech Solutions", date: "2024-01-18", applications: 32, status: "Active" },
//   ]);

//   const [projects, setProjects] = useState([
//     { id: 1, title: "AI Healthcare Diagnostics", type: "Research", date: "2024-01-22", applications: 23, status: "Active" },
//   ]);

//   const [mous, setMous] = useState([
//     { id: 1, university: "NUST", type: "Research Collaboration", status: "Active", date: "2023-11-15" },
//     { id: 2, university: "FAST NUCES", type: "Recruitment Drive", status: "Pending", date: "2024-02-01" },
//   ]);

//   const [userProfile, setUserProfile] = useState({
//     name: "Tech Solutions Ltd",
//     email: "hr@techsolutions.com",
//     logo: "https://ui-avatars.com/api/?name=Tech+Solutions&background=193648&color=fff&size=256"
//   });

//   const addInternship = (data: any) => {
//     const newInternship = {
//       id: Date.now(),
//       ...data,
//       date: new Date().toISOString().split('T')[0],
//       applications: 0,
//       status: "Active"
//     };
//     setInternships([newInternship, ...internships]);
//   };

//   const addProject = (data: any) => {
//     const newProject = {
//       id: Date.now(),
//       ...data,
//       date: new Date().toISOString().split('T')[0],
//       applications: 0,
//       status: "Active"
//     };
//     setProjects([newProject, ...projects]);
//   };

//   return (
//     <DashboardContext.Provider value={{
//       internships, addInternship,
//       projects, addProject,
//       mous, setMous,
//       userProfile, setUserProfile
//     }}>
//       {children}
//     </DashboardContext.Provider>
//   );
// };

// // --- REUSABLE COMPONENTS ---

// // A professional header component
// const Header = ({ title, back = false, actionIcon, onAction }: any) => {
//   const navigation = useNavigation<any>();
//   return (
//     <View style={styles.header}>
//       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//         <TouchableOpacity
//           onPress={() => back ? navigation.goBack() : navigation.openDrawer()}
//           style={styles.headerBtn}
//         >
//           <Ionicons name={back ? "arrow-back" : "menu"} size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{title}</Text>
//       </View>
//       {actionIcon && (
//         <TouchableOpacity onPress={onAction} style={styles.headerBtn}>
//           <Ionicons name={actionIcon} size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// // --- SCREENS ---

// function HomeScreen() {
//   const navigation = useNavigation<any>();
//   const { internships, projects, mous, userProfile } = useContext(DashboardContext);

//   return (
//     <View style={styles.screenContainer}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
//       <View style={styles.header}>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <TouchableOpacity onPress={() => navigation.openDrawer()}>
//             <Image source={{ uri: userProfile.logo }} style={styles.headerAvatar} />
//           </TouchableOpacity>
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.greetingText}>Welcome back,</Text>
//             <Text style={styles.headerTitle}>{userProfile.name}</Text>
//           </View>
//         </View>
//         <TouchableOpacity onPress={() => navigation.navigate("AIChatbot")} style={styles.aiFab}>
//           <Ionicons name="sparkles" size={20} color={COLORS.white} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

//         {/* Stats Row */}
//         <View style={styles.statsRow}>
//           <View style={styles.statCardSmall}>
//             <Text style={styles.statNumber}>{internships.length}</Text>
//             <Text style={styles.statLabel}>Internships</Text>
//           </View>
//           <View style={styles.statCardSmall}>
//             <Text style={styles.statNumber}>{projects.length}</Text>
//             <Text style={styles.statLabel}>Projects</Text>
//           </View>
//           <View style={styles.statCardSmall}>
//             <Text style={styles.statNumber}>{mous.length}</Text>
//             <Text style={styles.statLabel}>MoUs</Text>
//           </View>
//         </View>

//         <Text style={styles.sectionHeader}>Quick Actions</Text>

//         <View style={styles.cardContainer}>
//           <TouchableOpacity
//             style={styles.card}
//             activeOpacity={0.9}
//             onPress={() => navigation.navigate("PostInternship")}
//           >
//             <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
//               <Ionicons name="briefcase" size={28} color="#1565C0" />
//             </View>
//             <View style={styles.cardTextContainer}>
//               <Text style={styles.cardTitle}>Internships</Text>
//               <Text style={styles.cardDesc}>Post new roles & manage applications.</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.card}
//             activeOpacity={0.9}
//             onPress={() => navigation.navigate("ManageProjects")}
//           >
//             <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
//               <Ionicons name="flask" size={28} color="#2E7D32" />
//             </View>
//             <View style={styles.cardTextContainer}>
//               <Text style={styles.cardTitle}>R&D Projects</Text>
//               <Text style={styles.cardDesc}>Collaborate on research with universities.</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.card}
//             activeOpacity={0.9}
//             onPress={() => navigation.navigate("MoUs")}
//           >
//             <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
//               <Ionicons name="document-text" size={28} color="#E65100" />
//             </View>
//             <View style={styles.cardTextContainer}>
//               <Text style={styles.cardTitle}>Agreements (MoUs)</Text>
//               <Text style={styles.cardDesc}>View active partnership statuses.</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
//           </TouchableOpacity>
//         </View>

//         {/* Recent Activity Section */}
//         <Text style={styles.sectionHeader}>Recent Notifications</Text>
//         <View style={styles.notificationCard}>
//           <View style={styles.notifItem}>
//             <View style={styles.notifDot} />
//             <Text style={styles.notifText}>New application received for <Text style={{ fontWeight: 'bold' }}>Frontend Intern</Text></Text>
//             <Text style={styles.notifTime}>2h ago</Text>
//           </View>
//           <View style={[styles.notifItem, { borderBottomWidth: 0 }]}>
//             <View style={[styles.notifDot, { backgroundColor: COLORS.warning }]} />
//             <Text style={styles.notifText}>MoU with <Text style={{ fontWeight: 'bold' }}>NUST</Text> expires in 30 days</Text>
//             <Text style={styles.notifTime}>1d ago</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// function MoUScreen() {
//   const { mous } = useContext(DashboardContext);
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Collaborations (MoUs)" back={true} />
//       <FlatList
//         data={mous}
//         keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//         renderItem={({ item }) => (
//           <View style={styles.listItem}>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
//               <Text style={styles.listItemTitle}>{item.university}</Text>
//               <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? '#DEF7EC' : '#FEECDC' }]}>
//                 <Text style={[styles.statusText, { color: item.status === 'Active' ? COLORS.success : COLORS.warning }]}>{item.status}</Text>
//               </View>
//             </View>
//             <Text style={styles.listItemCompany}>{item.type}</Text>
//             <Text style={styles.listItemDate}>Signed: {item.date}</Text>
//             <TouchableOpacity style={styles.actionLink}>
//               <Text style={{ color: COLORS.primary, fontSize: 14, fontWeight: '600' }}>View Document</Text>
//               <Ionicons name="open-outline" size={16} color={COLORS.primary} />
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// // --- INTERNSHIP MANAGEMENT ---
// function PostInternship() {
//   const navigation = useNavigation();
//   const { internships } = useContext(DashboardContext);

//   const stats = {
//     active: internships.filter((i: any) => i.status === 'Active').length,
//     total: internships.length
//   };

//   const menuItems = [
//     { title: "Post New Internship", desc: "Create a new opportunity", icon: "add-circle", screen: "PostNewInternship", color: COLORS.primary },
//     { title: "Active Internships", desc: `Manage ${stats.active} active posts`, icon: "list", screen: "ViewPostedInternships", color: COLORS.secondary },
//     { title: "Drafts", desc: "2 saved drafts", icon: "document", screen: "DraftInternships", color: COLORS.textLight },
//   ];

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Internships" back={true} />
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.heroSection}>
//           <Text style={styles.heroTitle}>Manage Talent</Text>
//           <Text style={styles.heroSubtitle}>Find the best students for your company.</Text>
//         </View>

//         <View style={styles.gridContainer}>
//           {menuItems.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.menuCard}
//               onPress={() => navigation.navigate(item.screen as any)}
//             >
//               <Ionicons name={item.icon as any} size={32} color={item.color} style={{ marginBottom: 12 }} />
//               <Text style={styles.menuCardTitle}>{item.title}</Text>
//               <Text style={styles.menuCardDesc}>{item.desc}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// function PostNewInternshipScreen() {
//   const navigation = useNavigation();
//   const { addInternship } = useContext(DashboardContext);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({ title: '', company: '', desc: '', stipend: '', location: '' });

//   const handleSubmit = () => {
//     if (!formData.title || !formData.company) {
//       Alert.alert("Missing Fields", "Please fill in all required fields.");
//       return;
//     }
//     setLoading(true);
//     setTimeout(() => {
//       addInternship(formData);
//       setLoading(false);
//       Alert.alert("Success", "Internship Posted Successfully!", [
//         { text: "OK", onPress: () => navigation.navigate("ViewPostedInternships" as any) }
//       ]);
//     }, 1500);
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screenContainer}>
//       <Header title="New Internship" back={true} />
//       <ScrollView contentContainerStyle={styles.formContainer}>
//         <Text style={styles.formLabel}>Job Title *</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="e.g. React Native Intern"
//           value={formData.title}
//           onChangeText={t => setFormData({ ...formData, title: t })}
//         />

//         <Text style={styles.formLabel}>Company Name *</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Your Company Name"
//           value={formData.company}
//           onChangeText={t => setFormData({ ...formData, company: t })}
//         />

//         <Text style={styles.formLabel}>Location</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="e.g. Remote / Karachi"
//           value={formData.location}
//           onChangeText={t => setFormData({ ...formData, location: t })}
//         />

//         <Text style={styles.formLabel}>Stipend (PKR)</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="e.g. 25000"
//           keyboardType="numeric"
//           value={formData.stipend}
//           onChangeText={t => setFormData({ ...formData, stipend: t })}
//         />

//         <Text style={styles.formLabel}>Job Description</Text>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           placeholder="Describe responsibilities..."
//           multiline
//           numberOfLines={5}
//           value={formData.desc}
//           onChangeText={t => setFormData({ ...formData, desc: t })}
//         />

//         <TouchableOpacity
//           style={[styles.primaryButton, loading && { opacity: 0.7 }]}
//           onPress={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Publish Internship</Text>}
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// function ViewPostedInternshipsScreen() {
//   const { internships } = useContext(DashboardContext);
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Active Postings" back={true} />
//       <FlatList
//         data={internships}
//         contentContainerStyle={{ padding: 16 }}
//         keyExtractor={(item: any) => item.id.toString()}
//         ListEmptyComponent={<Text style={styles.emptyText}>No internships posted yet.</Text>}
//         renderItem={({ item }) => (
//           <View style={styles.listItem}>
//             <View style={styles.rowBetween}>
//               <Text style={styles.listItemTitle}>{item.title}</Text>
//               <View style={styles.activeTag}>
//                 <Text style={styles.activeTagText}>Active</Text>
//               </View>
//             </View>
//             <Text style={styles.listItemCompany}>{item.company}</Text>

//             <View style={styles.listStatsRow}>
//               <View style={styles.listStat}>
//                 <Ionicons name="people-outline" size={16} color={COLORS.textLight} />
//                 <Text style={styles.listStatText}>{item.applications} Applicants</Text>
//               </View>
//               <View style={styles.listStat}>
//                 <Ionicons name="calendar-outline" size={16} color={COLORS.textLight} />
//                 <Text style={styles.listStatText}>{item.date}</Text>
//               </View>
//             </View>

//             <View style={styles.divider} />

//             <View style={styles.rowBetween}>
//               <TouchableOpacity style={styles.textBtn}>
//                 <Text style={styles.textBtnText}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.outlineBtnSmall}>
//                 <Text style={styles.outlineBtnText}>View Applications</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// // Placeholder for Drafts
// function DraftInternshipsScreen() {
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Draft Internships" back={true} />
//       <View style={styles.centerContent}>
//         <Ionicons name="document-text-outline" size={64} color={COLORS.border} />
//         <Text style={styles.emptyText}>No drafts saved.</Text>
//       </View>
//     </View>
//   )
// }

// // --- PROJECT MANAGEMENT (Similar Logic) ---
// function ManageProjects() {
//   const navigation = useNavigation();
//   const { projects } = useContext(DashboardContext);

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Projects" back={true} />
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.heroSection}>
//           <View style={[styles.heroIcon, { backgroundColor: '#E8F5E9' }]}>
//             <Ionicons name="flask-outline" size={32} color="#2E7D32" />
//           </View>
//           <Text style={styles.heroTitle}>R&D Collaboration</Text>
//           <Text style={styles.heroSubtitle}>Connect with universities for innovation.</Text>
//         </View>

//         <View style={styles.listContainer}>
//           <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("PostNewProject")}>
//             <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
//             <Text style={styles.primaryButtonText}>Post New Project</Text>
//           </TouchableOpacity>

//           <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Your Projects</Text>

//           {projects.map((item: any) => (
//             <View key={item.id} style={styles.listItem}>
//               <Text style={styles.listItemTitle}>{item.title}</Text>
//               <Text style={styles.listItemCompany}>{item.type}</Text>
//               <View style={styles.listStatsRow}>
//                 <Text style={styles.listStatText}>{item.applications} Interest(s)</Text>
//                 <Text style={styles.listStatText}>• {item.status}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// function PostNewProjectScreen() {
//   const navigation = useNavigation();
//   const { addProject } = useContext(DashboardContext);
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('');

//   const handlePost = () => {
//     if (!title) return Alert.alert("Error", "Title is required");
//     addProject({ title, type: type || 'Research' });
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="New Project" back={true} />
//       <View style={styles.formContainer}>
//         <Text style={styles.formLabel}>Project Title</Text>
//         <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="AI Research..." />

//         <Text style={styles.formLabel}>Type</Text>
//         <TextInput style={styles.input} value={type} onChangeText={setType} placeholder="Research / Development" />

//         <Text style={styles.formLabel}>Description</Text>
//         <TextInput style={[styles.input, styles.textArea]} multiline numberOfLines={4} placeholder="Project details..." />

//         <TouchableOpacity style={styles.primaryButton} onPress={handlePost}>
//           <Text style={styles.primaryButtonText}>Submit Project</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )
// }

// // Stubs for other project screens
// const DraftProjectsScreen = () => <View style={styles.screenContainer}><Header title="Draft Projects" back={true} /></View>;
// const ViewPostedProjectsScreen = () => <View style={styles.screenContainer}><Header title="View Projects" back={true} /></View>;
// const ProjectApplicationsScreen = () => <View style={styles.screenContainer}><Header title="Applications" back={true} /></View>;

// // --- CHAT & AI ---

// function ChatScreen({ route }: any) {
//   const navigation = useNavigation();
//   const { conversation } = route.params;
//   const [messages, setMessages] = useState<any[]>([
//     { id: 1, text: "Hello! I am interested in the internship.", sender: 'them', time: '10:00 AM' },
//     { id: 2, text: "Hi! Thanks for applying. Do you have React experience?", sender: 'me', time: '10:05 AM' },
//   ]);
//   const [inputText, setInputText] = useState("");

//   const sendMessage = () => {
//     if (!inputText.trim()) return;
//     const newMsg = { id: Date.now(), text: inputText, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
//     setMessages([...messages, newMsg]);
//     setInputText("");
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screenContainer}>
//       <View style={styles.chatHeader}>
//         <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.primary} /></TouchableOpacity>
//         <Image source={{ uri: conversation.avatar }} style={styles.chatAvatar} />
//         <View>
//           <Text style={styles.chatName}>{conversation.name}</Text>
//           <Text style={styles.chatStatus}>Online</Text>
//         </View>
//       </View>

//       <FlatList
//         data={[...messages].reverse()}
//         inverted
//         keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//         renderItem={({ item }) => (
//           <View style={[styles.msgBubble, item.sender === 'me' ? styles.msgMe : styles.msgThem]}>
//             <Text style={[styles.msgText, item.sender === 'me' ? { color: '#fff' } : { color: COLORS.text }]}>{item.text}</Text>
//             <Text style={[styles.msgTime, item.sender === 'me' ? { color: '#e0e0e0' } : { color: COLORS.textLight }]}>{item.time}</Text>
//           </View>
//         )}
//       />

//       <View style={styles.chatInputBar}>
//         <TextInput
//           style={styles.chatInput}
//           placeholder="Type a message..."
//           value={inputText}
//           onChangeText={setInputText}
//         />
//         <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
//           <Ionicons name="send" size={20} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// function MessagesScreen() {
//   const navigation = useNavigation<any>();
//   const chats = [
//     { id: 1, name: "Ali Ahmed", msg: "Thank you for the opportunity!", time: "10:30 AM", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
//     { id: 2, name: "Riphah University", msg: "Meeting confirmed regarding MoU.", time: "Yesterday", avatar: "https://ui-avatars.com/api/?name=Riphah+University&background=0D8ABC&color=fff" },
//   ];

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Messages" back={true} />
//       <FlatList
//         data={chats}
//         keyExtractor={item => item.id.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate("ChatScreen", { conversation: item })}>
//             <Image source={{ uri: item.avatar }} style={styles.chatListAvatar} />
//             <View style={{ flex: 1 }}>
//               <View style={styles.rowBetween}>
//                 <Text style={styles.chatListName}>{item.name}</Text>
//                 <Text style={styles.chatListTime}>{item.time}</Text>
//               </View>
//               <Text style={styles.chatListMsg} numberOfLines={1}>{item.msg}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//       <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("NewMessage")}>
//         <Ionicons name="add" size={24} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// function AIChatbotScreen() {
//   const navigation = useNavigation();
//   const [msgs, setMsgs] = useState([{ id: 1, text: "Hi! I'm your AI Assistant. Need help with Internships or MoUs?", sender: 'ai' }]);
//   const [typing, setTyping] = useState(false);
//   const [input, setInput] = useState("");

//   const handleSend = () => {
//     if (!input) return;
//     const userMsg = { id: Date.now(), text: input, sender: 'user' };
//     setMsgs(prev => [...prev, userMsg]);
//     setInput("");
//     setTyping(true);

//     // Simulate AI thinking
//     setTimeout(() => {
//       const aiMsg = { id: Date.now() + 1, text: "I can certainly help with that. Please verify your company profile details first.", sender: 'ai' };
//       setMsgs(prev => [...prev, aiMsg]);
//       setTyping(false);
//     }, 1500);
//   };

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.primary} /></TouchableOpacity>
//         <Text style={styles.headerTitle}>AI Assistant</Text>
//         <Ionicons name="ellipsis-vertical" size={24} color={COLORS.primary} />
//       </View>
//       <FlatList
//         data={msgs}
//         keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//         renderItem={({ item }) => (
//           <View style={[styles.aiBubble, item.sender === 'user' ? styles.aiUser : styles.aiBot]}>
//             {item.sender === 'ai' && <Ionicons name="sparkles" size={16} color={COLORS.primary} style={{ marginRight: 8 }} />}
//             <Text style={item.sender === 'user' ? { color: '#fff' } : { color: COLORS.text }}>{item.text}</Text>
//           </View>
//         )}
//       />
//       {typing && <Text style={{ marginLeft: 20, marginBottom: 10, color: COLORS.textLight, fontStyle: 'italic' }}>AI is typing...</Text>}
//       <View style={styles.chatInputBar}>
//         <TextInput style={styles.chatInput} placeholder="Ask AI anything..." value={input} onChangeText={setInput} />
//         <TouchableOpacity style={[styles.sendBtn, { backgroundColor: COLORS.secondary }]} onPress={handleSend}>
//           <Ionicons name="arrow-up" size={20} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const NewMessageScreen = () => <View style={styles.screenContainer}><Header title="New Message" back={true} /></View>;

// // --- PROFILE ---
// function ProfileScreen() {
//   const { userProfile, setUserProfile } = useContext(DashboardContext);
//   const navigation = useNavigation();

//   return (
//     <ScrollView style={styles.screenContainer}>
//       <Header title="Company Profile" back={true} />
//       <View style={{ alignItems: 'center', padding: 24, backgroundColor: '#fff' }}>
//         <Image source={{ uri: userProfile.logo }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16 }} />
//         <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.primary }}>{userProfile.name}</Text>
//         <Text style={{ color: COLORS.textLight }}>{userProfile.email}</Text>
//         <TouchableOpacity style={{ marginTop: 16, padding: 8, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8 }}>
//           <Text style={{ color: COLORS.primary }}>Change Logo</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.formContainer}>
//         <Text style={styles.sectionHeader}>Company Details</Text>

//         <Text style={styles.formLabel}>Industry</Text>
//         <TextInput style={styles.input} value="Software Development" />

//         <Text style={styles.formLabel}>Website</Text>
//         <TextInput style={styles.input} value="https://techsolutions.com" />

//         <Text style={styles.formLabel}>Address</Text>
//         <TextInput style={styles.input} value="Islamabad, Pakistan" />

//         <TouchableOpacity style={styles.primaryButton}>
//           <Text style={styles.primaryButtonText}>Save Changes</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   )
// }

// // --- DRAWER ---
// function CustomDrawer(props: any) {
//   const { userProfile } = useContext(DashboardContext);
//   return (
//     <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: COLORS.white, flex: 1 }}>
//       <View style={styles.drawerHeader}>
//         <Image source={{ uri: userProfile.logo }} style={styles.drawerAvatar} />
//         <Text style={styles.drawerName}>{userProfile.name}</Text>
//         <Text style={styles.drawerEmail}>Industry Account</Text>
//       </View>
//       <View style={{ flex: 1, paddingTop: 10 }}>
//         <DrawerItemList {...props} />
//       </View>
//       <TouchableOpacity style={styles.logoutItem} onPress={() => alert('Logging out...')}>
//         <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
//         <Text style={{ color: COLORS.danger, marginLeft: 16, fontSize: 16, fontWeight: '500' }}>Logout</Text>
//       </TouchableOpacity>
//     </DrawerContentScrollView>
//   );
// }

// const Drawer = createDrawerNavigator();

// const MainApp = () => {
//   return (
//     <DashboardProvider>
//       <Drawer.Navigator
//         drawerContent={props => <CustomDrawer {...props} />}
//         screenOptions={{
//           headerShown: false,
//           drawerActiveBackgroundColor: COLORS.accent,
//           drawerActiveTintColor: COLORS.primary,
//           drawerInactiveTintColor: COLORS.textLight,
//           drawerLabelStyle: { marginLeft: -10, fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', fontSize: 15 }
//         }}
//       >
//         <Drawer.Screen name="Home" component={HomeScreen} options={{ drawerIcon: ({ color }) => <Ionicons name="grid-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="PostInternship" component={PostInternship} options={{ title: 'Internships', drawerIcon: ({ color }) => <Ionicons name="briefcase-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="ManageProjects" component={ManageProjects} options={{ title: 'Projects', drawerIcon: ({ color }) => <Ionicons name="flask-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="MoUs" component={MoUScreen} options={{ title: 'MoUs', drawerIcon: ({ color }) => <Ionicons name="document-text-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="MessagesMain" component={MessagesScreen} options={{ title: 'Messages', drawerIcon: ({ color }) => <Ionicons name="chatbubble-ellipses-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="Profile" component={ProfileScreen} options={{ drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="AIChatbot" component={AIChatbotScreen} options={{ title: 'AI Assistant', drawerIcon: ({ color }) => <Ionicons name="sparkles-outline" size={22} color={color} /> }} />

//         {/* Hidden Screens */}
//         <Drawer.Screen name="PostNewInternship" component={PostNewInternshipScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//         <Drawer.Screen name="ViewPostedInternships" component={ViewPostedInternshipsScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//         <Drawer.Screen name="DraftInternships" component={DraftInternshipsScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//         <Drawer.Screen name="PostNewProject" component={PostNewProjectScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//         <Drawer.Screen name="ChatScreen" component={ChatScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//         <Drawer.Screen name="NewMessage" component={NewMessageScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//       </Drawer.Navigator>
//     </DashboardProvider>
//   );
// };

// export default function App() {
//   return (
//     // If using Expo Router, you might not need NavigationContainer
//     // But for standalone usage:
//     // <NavigationContainer>
//     <MainApp />
//     // </NavigationContainer>
//   );
// }

// // --- STYLES ---
// const styles = StyleSheet.create({
//   screenContainer: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   header: {
//     backgroundColor: COLORS.white,
//     paddingTop: Platform.OS === 'ios' ? 50 : 40,
//     paddingBottom: 16,
//     paddingHorizontal: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.primary,
//   },
//   greetingText: {
//     fontSize: 12,
//     color: COLORS.textLight,
//   },
//   headerAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: COLORS.accent,
//   },
//   headerBtn: {
//     padding: 8,
//   },
//   aiFab: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     elevation: 5
//   },

//   // Dashboard Home Styles
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 24,
//   },
//   statCardSmall: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginHorizontal: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     elevation: 2,
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     marginTop: 4,
//   },
//   sectionHeader: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.text,
//     marginBottom: 12,
//     marginLeft: 4,
//   },
//   cardContainer: {
//     gap: 12,
//   },
//   card: {
//     backgroundColor: COLORS.white,
//     padding: 16,
//     borderRadius: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     elevation: 2,
//     marginBottom: 4,
//   },
//   iconCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   cardTextContainer: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.text,
//   },
//   cardDesc: {
//     fontSize: 13,
//     color: COLORS.textLight,
//     marginTop: 2,
//   },
//   notificationCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: 16,
//     paddingHorizontal: 16,
//   },
//   notifItem: {
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   notifDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: COLORS.primary,
//     marginTop: 6,
//     marginRight: 12,
//   },
//   notifText: {
//     flex: 1,
//     fontSize: 14,
//     color: COLORS.text,
//     lineHeight: 20,
//   },
//   notifTime: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     marginLeft: 8,
//   },

//   // Lists & Items
//   listItem: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(0,0,0,0.03)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     elevation: 2,
//   },
//   listItemTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.text,
//   },
//   listItemCompany: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     marginTop: 2,
//   },
//   listItemDate: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 8
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: '700',
//     textTransform: 'uppercase',
//   },
//   actionLink: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginTop: 12
//   },

//   // Menu Grid
//   heroSection: {
//     paddingVertical: 24,
//     alignItems: 'center',
//   },
//   heroIcon: {
//     width: 64, height: 64, borderRadius: 32,
//     justifyContent: 'center', alignItems: 'center', marginBottom: 16
//   },
//   heroTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//   },
//   heroSubtitle: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     marginTop: 4,
//   },
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   menuCard: {
//     width: (width - 44) / 2, // 2 columns
//     backgroundColor: COLORS.white,
//     padding: 16,
//     borderRadius: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   menuCardTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: COLORS.text,
//     textAlign: 'center',
//   },
//   menuCardDesc: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     textAlign: 'center',
//     marginTop: 4,
//   },

//   // Forms
//   formContainer: {
//     padding: 20,
//   },
//   formLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.primary,
//     marginBottom: 8,
//     marginTop: 16,
//   },
//   input: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: COLORS.text,
//   },
//   textArea: {
//     textAlignVertical: 'top',
//     height: 100,
//   },
//   primaryButton: {
//     backgroundColor: COLORS.primary,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 32,
//     flexDirection: 'row',
//     justifyContent: 'center'
//   },
//   primaryButtonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   // Chat
//   chatHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//     padding: 16,
//     backgroundColor: COLORS.white,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   chatAvatar: {
//     width: 36, height: 36, borderRadius: 18, marginLeft: 16, marginRight: 12,
//   },
//   chatName: {
//     fontSize: 16, fontWeight: '700', color: COLORS.text
//   },
//   chatStatus: {
//     fontSize: 12, color: COLORS.success,
//   },
//   chatInputBar: {
//     padding: 16,
//     backgroundColor: COLORS.white,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   chatInput: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//     borderRadius: 24,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     marginRight: 12,
//     color: COLORS.text,
//   },
//   sendBtn: {
//     width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary,
//     justifyContent: 'center', alignItems: 'center'
//   },
//   msgBubble: {
//     padding: 12, borderRadius: 16, maxWidth: '80%', marginBottom: 12,
//   },
//   msgMe: {
//     alignSelf: 'flex-end', backgroundColor: COLORS.primary,
//     borderBottomRightRadius: 2,
//   },
//   msgThem: {
//     alignSelf: 'flex-start', backgroundColor: COLORS.white,
//     borderBottomLeftRadius: 2, borderWidth: 1, borderColor: COLORS.border,
//   },
//   msgText: {
//     fontSize: 15,
//   },
//   msgTime: {
//     fontSize: 10, marginTop: 4, alignSelf: 'flex-end',
//   },

//   // Chat List
//   chatItem: {
//     flexDirection: 'row',
//     padding: 16,
//     backgroundColor: COLORS.white,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.background,
//   },
//   chatListAvatar: {
//     width: 50, height: 50, borderRadius: 25, marginRight: 16,
//   },
//   chatListName: {
//     fontSize: 16, fontWeight: '600', color: COLORS.text,
//   },
//   chatListTime: {
//     fontSize: 12, color: COLORS.textLight,
//   },
//   chatListMsg: {
//     fontSize: 14, color: COLORS.textLight, marginTop: 4,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 24, right: 24,
//     width: 56, height: 56, borderRadius: 28,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center', alignItems: 'center',
//     elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3
//   },

//   // Drawer
//   drawerHeader: {
//     padding: 24, paddingTop: 48,
//     backgroundColor: '#f8f9fa',
//     borderBottomWidth: 1, borderBottomColor: COLORS.border,
//   },
//   drawerAvatar: {
//     width: 64, height: 64, borderRadius: 32, marginBottom: 12,
//   },
//   drawerName: {
//     fontSize: 18, fontWeight: 'bold', color: COLORS.primary,
//   },
//   drawerEmail: {
//     fontSize: 13, color: COLORS.textLight,
//   },
//   logoutItem: {
//     flexDirection: 'row', alignItems: 'center', padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border,
//   },

//   // Misc Utilities
//   rowBetween: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//   },
//   activeTag: {
//     backgroundColor: '#DEF7EC', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
//   },
//   activeTagText: {
//     color: COLORS.success, fontSize: 10, fontWeight: '700', textTransform: 'uppercase',
//   },
//   listStatsRow: {
//     flexDirection: 'row', marginTop: 12, gap: 16,
//   },
//   listStat: {
//     flexDirection: 'row', alignItems: 'center', gap: 6,
//   },
//   listStatText: {
//     fontSize: 12, color: COLORS.textLight,
//   },
//   divider: {
//     height: 1, backgroundColor: COLORS.border, marginVertical: 12,
//   },
//   textBtn: {
//     padding: 4,
//   },
//   textBtnText: {
//     color: COLORS.textLight, fontSize: 13, fontWeight: '500',
//   },
//   outlineBtnSmall: {
//     borderWidth: 1, borderColor: COLORS.primary, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 4,
//   },
//   outlineBtnText: {
//     color: COLORS.primary, fontSize: 12, fontWeight: '500',
//   },
//   centerContent: {
//     flex: 1, justifyContent: 'center', alignItems: 'center',
//   },
//   emptyText: {
//     marginTop: 16, color: COLORS.textLight, fontSize: 16,
//   },

//   // AI Specific
//   aiBubble: {
//     padding: 12, borderRadius: 12, maxWidth: '85%', marginBottom: 12, flexDirection: 'row',
//   },
//   aiBot: {
//     alignSelf: 'flex-start', backgroundColor: '#E3F2FD',
//   },
//   aiUser: {
//     alignSelf: 'flex-end', backgroundColor: COLORS.primary,
//   },
// });


// import { Ionicons } from "@expo/vector-icons";
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList,
// } from "@react-navigation/drawer";
// import { useNavigation } from "@react-navigation/native";
// import * as ImagePicker from 'expo-image-picker'; // Image Picker Import
// import React, { createContext, useContext, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";

// const { width } = Dimensions.get('window');

// // --- THEME & CONSTANTS ---
// const COLORS = {
//   primary: "#193648",
//   secondary: "#2C5364",
//   accent: "#e8f0f5",
//   background: "#F5F7FA",
//   white: "#FFFFFF",
//   text: "#1F2937",
//   textLight: "#6B7280",
//   success: "#10B981",
//   warning: "#F59E0B",
//   danger: "#EF4444",
//   border: "#E5E7EB"
// };

// // --- DATA CONTEXT (The Logic Engine) ---
// const DashboardContext = createContext<any>(null);

// const DashboardProvider = ({ children }: any) => {
//   // Mock Data State
//   const [internships, setInternships] = useState([
//     { id: 1, title: "Frontend Developer Intern", company: "Tech Solutions", date: "2024-01-20", applications: 45, status: "Active" },
//     { id: 2, title: "Mobile App Developer", company: "Tech Solutions", date: "2024-01-18", applications: 32, status: "Active" },
//   ]);

//   const [projects, setProjects] = useState([
//     { id: 1, title: "AI Healthcare Diagnostics", type: "Research", date: "2024-01-22", applications: 23, status: "Active" },
//   ]);

//   const [mous, setMous] = useState([
//     { id: 1, university: "Riphah International University", dept: "SE Department", type: "Research Collaboration", status: "Active", date: "2023-11-15" },
//     { id: 2, university: "Riphah International University", dept: "SE Department", type: "Recruitment Drive", status: "Pending", date: "2024-02-01" },
//   ]);

//   const [userProfile, setUserProfile] = useState({
//     name: "Tech Solutions Ltd",
//     email: "hr@techsolutions.com",
//     logo: "https://ui-avatars.com/api/?name=Tech+Solutions&background=193648&color=fff&size=256"
//   });

//   const addInternship = (data: any) => {
//     const newInternship = {
//       id: Date.now(),
//       ...data,
//       date: new Date().toISOString().split('T')[0],
//       applications: 0,
//       status: "Active"
//     };
//     setInternships([newInternship, ...internships]);
//   };

//   const addProject = (data: any) => {
//     const newProject = {
//       id: Date.now(),
//       ...data,
//       date: new Date().toISOString().split('T')[0],
//       applications: 0,
//       status: "Active"
//     };
//     setProjects([newProject, ...projects]);
//   };

//   // New Logic for Adding MoU
//   const addMoU = (data: any) => {
//     const newMoU = {
//       id: Date.now(),
//       ...data,
//       status: "Pending", // Default status
//       date: new Date().toISOString().split('T')[0],
//     };
//     setMous([newMoU, ...mous]);
//   };

//   // Logic for Updating Profile Image
//   const updateLogo = (uri: string) => {
//     setUserProfile(prev => ({ ...prev, logo: uri }));
//   };

//   return (
//     <DashboardContext.Provider value={{
//       internships, addInternship,
//       projects, addProject,
//       mous, addMoU,
//       userProfile, updateLogo
//     }}>
//       {children}
//     </DashboardContext.Provider>
//   );
// };

// // --- REUSABLE COMPONENTS ---
// const Header = ({ title, back = false, actionIcon, onAction }: any) => {
//   const navigation = useNavigation<any>();
//   return (
//     <View style={styles.header}>
//       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//         <TouchableOpacity
//           onPress={() => back ? navigation.goBack() : navigation.openDrawer()}
//           style={styles.headerBtn}
//         >
//           <Ionicons name={back ? "arrow-back" : "menu"} size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{title}</Text>
//       </View>
//       {actionIcon && (
//         <TouchableOpacity onPress={onAction} style={styles.headerBtn}>
//           <Ionicons name={actionIcon} size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// // --- SCREENS ---

// function HomeScreen() {
//   const navigation = useNavigation<any>();
//   const { internships, projects, mous, userProfile } = useContext(DashboardContext);

//   return (
//     <View style={styles.screenContainer}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
//       <View style={styles.header}>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <TouchableOpacity onPress={() => navigation.openDrawer()}>
//             <Image source={{ uri: userProfile.logo }} style={styles.headerAvatar} />
//           </TouchableOpacity>
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.greetingText}>Welcome back,</Text>
//             <Text style={styles.headerTitle}>{userProfile.name}</Text>
//           </View>
//         </View>
//         <TouchableOpacity onPress={() => navigation.navigate("AIChatbot")} style={styles.aiFab}>
//           <Ionicons name="sparkles" size={20} color={COLORS.white} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         <View style={styles.statsRow}>
//           <View style={styles.statCardSmall}>
//             <Text style={styles.statNumber}>{internships.length}</Text>
//             <Text style={styles.statLabel}>Internships</Text>
//           </View>
//           <View style={styles.statCardSmall}>
//             <Text style={styles.statNumber}>{projects.length}</Text>
//             <Text style={styles.statLabel}>Projects</Text>
//           </View>
//           <View style={styles.statCardSmall}>
//             <Text style={styles.statNumber}>{mous.length}</Text>
//             <Text style={styles.statLabel}>MoUs</Text>
//           </View>
//         </View>

//         <Text style={styles.sectionHeader}>Quick Actions</Text>

//         <View style={styles.cardContainer}>
//           <TouchableOpacity
//             style={styles.card}
//             activeOpacity={0.9}
//             onPress={() => navigation.navigate("PostInternship")}
//           >
//             <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
//               <Ionicons name="briefcase" size={28} color="#1565C0" />
//             </View>
//             <View style={styles.cardTextContainer}>
//               <Text style={styles.cardTitle}>Internships</Text>
//               <Text style={styles.cardDesc}>Post roles & manage applicants.</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.card}
//             activeOpacity={0.9}
//             onPress={() => navigation.navigate("ManageProjects")}
//           >
//             <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
//               <Ionicons name="flask" size={28} color="#2E7D32" />
//             </View>
//             <View style={styles.cardTextContainer}>
//               <Text style={styles.cardTitle}>R&D Projects</Text>
//               <Text style={styles.cardDesc}>Collaborate with Riphah International University.</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.card}
//             activeOpacity={0.9}
//             onPress={() => navigation.navigate("MoUs")}
//           >
//             <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
//               <Ionicons name="document-text" size={28} color="#E65100" />
//             </View>
//             <View style={styles.cardTextContainer}>
//               <Text style={styles.cardTitle}>Agreements (MoUs)</Text>
//               <Text style={styles.cardDesc}>Manage collaborations.</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // --- UPDATED MOU SCREEN (With Create Logic) ---
// function MoUScreen() {
//   const navigation = useNavigation<any>();
//   const { mous } = useContext(DashboardContext);

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Collaborations (MoUs)" back={true} />

//       {/* Create Button */}
//       <View style={{ padding: 16, paddingBottom: 0 }}>
//         <TouchableOpacity
//           style={styles.createButton}
//           onPress={() => navigation.navigate('CreateMoU')}
//         >
//           <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
//           <Text style={styles.createButtonText}>Request New MoU</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={mous}
//         keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//         renderItem={({ item }) => (
//           <View style={styles.listItem}>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
//               <View>
//                 <Text style={styles.listItemTitle}>{item.university}</Text>
//                 <Text style={styles.listSubText}>{item.dept}</Text>
//               </View>
//               <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? '#DEF7EC' : '#FEECDC' }]}>
//                 <Text style={[styles.statusText, { color: item.status === 'Active' ? COLORS.success : COLORS.warning }]}>{item.status}</Text>
//               </View>
//             </View>

//             <View style={styles.divider} />

//             <View style={styles.rowBetween}>
//               <Text style={styles.listItemCompany}>{item.type}</Text>
//               <Text style={styles.listItemDate}>{item.date}</Text>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// // --- NEW SCREEN: CREATE MOU ---
// function CreateMoUScreen() {
//   const navigation = useNavigation();
//   const { addMoU } = useContext(DashboardContext);
//   const [loading, setLoading] = useState(false);

//   // Form State
//   const [uniName, setUniName] = useState('Riphah International University'); // Default
//   const [dept, setDept] = useState('');
//   const [type, setType] = useState('');
//   const [desc, setDesc] = useState('');

//   const handleCreate = () => {
//     if (!dept || !type) {
//       Alert.alert("Missing Details", "Please specify the department and collaboration type.");
//       return;
//     }

//     setLoading(true);
//     setTimeout(() => {
//       addMoU({
//         university: uniName,
//         dept: dept,
//         type: type,
//         description: desc
//       });
//       setLoading(false);
//       Alert.alert("Request Sent", "Your MoU request has been sent to Riphah Administration.", [
//         { text: "OK", onPress: () => navigation.goBack() }
//       ]);
//     }, 1500);
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screenContainer}>
//       <Header title="Request MoU" back={true} />
//       <ScrollView contentContainerStyle={styles.formContainer}>
//         <Text style={styles.sectionHeader}>Partnership Details</Text>

//         <Text style={styles.formLabel}>University Name</Text>
//         <TextInput
//           style={[styles.input, { backgroundColor: '#f0f0f0', color: '#555' }]}
//           value={uniName}
//           editable={false} // Locked to Riphah or can be editable
//         />

//         <Text style={styles.formLabel}>Department *</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="e.g. Software Engineering Department"
//           value={dept}
//           onChangeText={setDept}
//         />

//         <Text style={styles.formLabel}>Collaboration Type *</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="e.g. Research, Internship Drive, Seminars"
//           value={type}
//           onChangeText={setType}
//         />

//         <Text style={styles.formLabel}>Proposal / Description</Text>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           placeholder="Briefly describe the objectives of this MoU..."
//           multiline
//           numberOfLines={5}
//           value={desc}
//           onChangeText={setDesc}
//         />

//         <TouchableOpacity
//           style={styles.primaryButton}
//           onPress={handleCreate}
//           disabled={loading}
//         >
//           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Submit Request</Text>}
//         </TouchableOpacity>

//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// // --- UPDATED MESSAGES SCREEN (University Only) ---
// function MessagesScreen() {
//   const navigation = useNavigation<any>();

//   // Hardcoded to University Departments only
//   const chats = [
//     {
//       id: 1,
//       name: "Internship Incharge",
//       role: "Software Engineering Dept",
//       msg: "We have received your internship applications.",
//       time: "10:30 AM",
//       avatar: "https://ui-avatars.com/api/?name=ORIC+Incharge&background=193648&color=fff"
//     },
//     {
//       id: 2,
//       name: "Placement Office",
//       role: "Industry laison Incharge",
//       msg: "Can we schedule an interview session next week?",
//       time: "Yesterday",
//       avatar: "https://ui-avatars.com/api/?name=Placement+Office&background=2C5364&color=fff"
//     },
//     {
//       id: 3,
//       name: "Dr. Ali",
//       role: "Computer Science Dept",
//       msg: "Your requested CVs are ready for review.",
//       time: "2 days ago",
//       avatar: "https://ui-avatars.com/api/?name=Dr+Ali&background=0D8ABC&color=fff"
//     },
//   ];

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Messages" back={true} />
//       <FlatList
//         data={chats}
//         keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ paddingTop: 8 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate("ChatScreen", { conversation: item })}>
//             <Image source={{ uri: item.avatar }} style={styles.chatListAvatar} />
//             <View style={{ flex: 1 }}>
//               <View style={styles.rowBetween}>
//                 <Text style={styles.chatListName}>{item.name}</Text>
//                 <Text style={styles.chatListTime}>{item.time}</Text>
//               </View>
//               <Text style={{ fontSize: 11, color: COLORS.primary, marginBottom: 2 }}>{item.role}</Text>
//               <Text style={styles.chatListMsg} numberOfLines={1}>{item.msg}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// // --- UPDATED PROFILE SCREEN (Working Image Picker) ---
// function ProfileScreen() {
//   const { userProfile, updateLogo } = useContext(DashboardContext);

//   const pickImage = async () => {
//     // Request Permission
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to change your logo!');
//       return;
//     }

//     // Open Picker
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       updateLogo(result.assets[0].uri);
//     }
//   };

//   return (
//     <ScrollView style={styles.screenContainer}>
//       <Header title="Company Profile" back={true} />

//       <View style={styles.profileHeaderCard}>
//         <View style={styles.imageWrapper}>
//           <Image source={{ uri: userProfile.logo }} style={styles.profileBigImage} />
//           <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
//             <Ionicons name="camera" size={18} color="#fff" />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.profileName}>{userProfile.name}</Text>
//         <Text style={styles.profileEmail}>{userProfile.email}</Text>
//         <View style={styles.activeStatusTag}>
//           <View style={styles.greenDot} />
//           <Text style={styles.activeText}>Verified Industry Partner</Text>
//         </View>
//       </View>

//       <View style={styles.formContainer}>
//         <Text style={styles.sectionHeader}>Company Details</Text>
//         <Text style={styles.formLabel}>Industry Sector</Text>
//         <TextInput style={styles.input} value="Software Development" editable={false} />

//         <Text style={styles.formLabel}>Headquarters</Text>
//         <TextInput style={styles.input} value="Islamabad, Pakistan" />

//         <Text style={styles.formLabel}>Focal Person</Text>
//         <TextInput style={styles.input} value="Mr. Ahmed Khan" />

//         <TouchableOpacity style={styles.primaryButton}>
//           <Text style={styles.primaryButtonText}>Update Profile</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   )
// }

// // --- OTHER EXISTING SCREENS (Briefcase, Chat, etc.) ---
// function PostInternship() {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Internships" back={true} />
//       <View style={styles.centerContent}>
//         <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("PostNewInternship" as any)}>
//           <Text style={styles.primaryButtonText}>Post New Internship</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.primaryButton, { marginTop: 12, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary }]} onPress={() => navigation.navigate("ViewPostedInternships" as any)}>
//           <Text style={[styles.primaryButtonText, { color: COLORS.primary }]}>View Posted Jobs</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// function PostNewInternshipScreen() {
//   const navigation = useNavigation();
//   const { addInternship } = useContext(DashboardContext);
//   const [title, setTitle] = useState("");

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Post Job" back={true} />
//       <View style={styles.formContainer}>
//         <Text style={styles.formLabel}>Title</Text>
//         <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Internship Title" />
//         <TouchableOpacity style={styles.primaryButton} onPress={() => { addInternship({ title, company: "My Company" }); navigation.goBack(); }}>
//           <Text style={styles.primaryButtonText}>Submit</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )
// }

// function ViewPostedInternshipsScreen() {
//   const { internships } = useContext(DashboardContext);
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="My Posts" back={true} />
//       <FlatList data={internships} renderItem={({ item }) => (
//         <View style={styles.listItem}><Text style={styles.listItemTitle}>{item.title}</Text></View>
//       )} />
//     </View>
//   )
// }

// function ManageProjects() {
//   const navigation = useNavigation();
//   const { projects } = useContext(DashboardContext);
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Projects" back={true} />
//       <TouchableOpacity style={[styles.primaryButton, { margin: 16 }]} onPress={() => navigation.navigate("PostNewProject" as any)}>
//         <Text style={styles.primaryButtonText}>Add Project</Text>
//       </TouchableOpacity>
//       <FlatList data={projects} renderItem={({ item }: any) => (
//         <View style={[styles.listItem, { marginHorizontal: 16 }]}><Text style={styles.listItemTitle}>{item.title}</Text></View>
//       )} />
//     </View>
//   )
// }
// function PostNewProjectScreen() {
//   const navigation = useNavigation();
//   const { addProject } = useContext(DashboardContext);
//   const [title, setTitle] = useState("");
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="New Project" back={true} />
//       <View style={styles.formContainer}>
//         <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Project Title" />
//         <TouchableOpacity style={styles.primaryButton} onPress={() => { addProject({ title, type: "Research" }); navigation.goBack(); }}>
//           <Text style={styles.primaryButtonText}>Save</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )
// }

// function ChatScreen({ route }: any) {
//   const navigation = useNavigation();
//   const { conversation } = route.params;
//   const [messages, setMessages] = useState([
//     { id: 1, text: conversation.msg, sender: 'them', time: conversation.time }
//   ]);
//   const [text, setText] = useState("");

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screenContainer}>
//       <Header title={conversation.name} back={true} />
//       <FlatList data={messages} renderItem={({ item }) => (
//         <View style={[styles.msgBubble, item.sender === 'me' ? styles.msgMe : styles.msgThem]}>
//           <Text style={{ color: item.sender === 'me' ? '#fff' : '#333' }}>{item.text}</Text>
//         </View>
//       )} contentContainerStyle={{ padding: 16 }} />
//       <View style={styles.chatInputBar}>
//         <TextInput style={styles.chatInput} value={text} onChangeText={setText} placeholder="Message University..." />
//         <TouchableOpacity onPress={() => { if (text) { setMessages([...messages, { id: Date.now(), text, sender: 'me', time: 'Now' }]); setText(""); } }}>
//           <Ionicons name="send" size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   )
// }

// function AIChatbotScreen() {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="AI Assistant" back={true} />
//       <View style={styles.centerContent}><Text>CXbot</Text></View>
//     </View>
//   )
// }

// // --- DRAWER CONTENT ---
// function CustomDrawer(props: any) {
//   const { userProfile } = useContext(DashboardContext);
//   return (
//     <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: COLORS.white, flex: 1 }}>
//       <View style={styles.drawerHeader}>
//         <Image source={{ uri: userProfile.logo }} style={styles.drawerAvatar} />
//         <Text style={styles.drawerName}>{userProfile.name}</Text>
//         <Text style={styles.drawerEmail}>Industry Partner</Text>
//       </View>
//       <View style={{ flex: 1, paddingTop: 10 }}>
//         <DrawerItemList {...props} />
//       </View>
//     </DrawerContentScrollView>
//   );
// }

// const Drawer = createDrawerNavigator();

// const MainApp = () => {
//   return (
//     <DashboardProvider>
//       <Drawer.Navigator
//         drawerContent={props => <CustomDrawer {...props} />}
//         screenOptions={{
//           headerShown: false,
//           drawerActiveBackgroundColor: COLORS.accent,
//           drawerActiveTintColor: COLORS.primary,
//           drawerInactiveTintColor: COLORS.textLight,
//           drawerLabelStyle: { marginLeft: -10, fontSize: 15 }
//         }}
//       >
//         <Drawer.Screen name="Home" component={HomeScreen} options={{ drawerIcon: ({ color }) => <Ionicons name="grid-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="PostInternship" component={PostInternship} options={{ title: 'Internships', drawerIcon: ({ color }) => <Ionicons name="briefcase-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="ManageProjects" component={ManageProjects} options={{ title: 'Projects', drawerIcon: ({ color }) => <Ionicons name="flask-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="MoUs" component={MoUScreen} options={{ title: 'MoUs & Agreements', drawerIcon: ({ color }) => <Ionicons name="document-text-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="MessagesMain" component={MessagesScreen} options={{ title: 'Uni. Messages', drawerIcon: ({ color }) => <Ionicons name="chatbubbles-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="Profile" component={ProfileScreen} options={{ drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} /> }} />
//         <Drawer.Screen name="AIChatbot" component={AIChatbotScreen} options={{ title: 'AI Assistant', drawerIcon: ({ color }) => <Ionicons name="sparkles-outline" size={22} color={color} /> }} />

//         {/* Hidden Screens */}
//         <Drawer.Screen name="CreateMoU" component={CreateMoUScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//         <Drawer.Screen name="PostNewInternship" component={PostNewInternshipScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//         <Drawer.Screen name="ViewPostedInternships" component={ViewPostedInternshipsScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//         <Drawer.Screen name="PostNewProject" component={PostNewProjectScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//         <Drawer.Screen name="ChatScreen" component={ChatScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//       </Drawer.Navigator>
//     </DashboardProvider>
//   );
// };

// export default function App() {
//   return (
//     <MainApp />
//   );
// }

// // --- STYLES ---
// const styles = StyleSheet.create({
//   screenContainer: { flex: 1, backgroundColor: COLORS.background },
//   scrollContent: { padding: 16, paddingBottom: 40 },
//   header: {
//     backgroundColor: COLORS.white,
//     paddingTop: Platform.OS === 'ios' ? 50 : 40,
//     paddingBottom: 16,
//     paddingHorizontal: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//     elevation: 3,
//   },
//   headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
//   greetingText: { fontSize: 12, color: COLORS.textLight },
//   headerAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
//   headerBtn: { padding: 8 },
//   aiFab: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 5 },

//   // Dashboard Stats
//   statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
//   statCardSmall: { flex: 1, backgroundColor: COLORS.white, padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, elevation: 2 },
//   statNumber: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
//   statLabel: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
//   sectionHeader: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 12, marginLeft: 4 },

//   // Cards
//   cardContainer: { gap: 12 },
//   card: { backgroundColor: COLORS.white, padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', elevation: 2, marginBottom: 4 },
//   iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
//   cardTextContainer: { flex: 1 },
//   cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
//   cardDesc: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },

//   // List Items (MoU, etc)
//   listItem: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
//   listItemTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
//   listSubText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
//   listItemCompany: { fontSize: 14, color: COLORS.textLight },
//   listItemDate: { fontSize: 12, color: '#999' },
//   statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
//   statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
//   divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 10 },
//   rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

//   // Profile Specific
//   profileHeaderCard: { backgroundColor: COLORS.white, alignItems: 'center', padding: 24, marginBottom: 16, borderBottomWidth: 1, borderColor: COLORS.border },
//   imageWrapper: { position: 'relative', marginBottom: 16 },
//   profileBigImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: COLORS.accent },
//   cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
//   profileName: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
//   profileEmail: { fontSize: 14, color: COLORS.textLight, marginBottom: 12 },
//   activeStatusTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DEF7EC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
//   greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginRight: 8 },
//   activeText: { fontSize: 12, color: COLORS.success, fontWeight: '600' },

//   // Forms
//   formContainer: { padding: 20 },
//   formLabel: { fontSize: 14, fontWeight: '600', color: COLORS.primary, marginBottom: 8, marginTop: 16 },
//   input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12, fontSize: 16, color: COLORS.text },
//   textArea: { textAlignVertical: 'top', height: 100 },
//   primaryButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
//   primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
//   createButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.secondary, padding: 14, borderRadius: 10, marginBottom: 12 },
//   createButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },

//   // Chat List
//   chatItem: { flexDirection: 'row', padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
//   chatListAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
//   chatListName: { fontSize: 16, fontWeight: '600', color: COLORS.text },
//   chatListTime: { fontSize: 12, color: COLORS.textLight },
//   chatListMsg: { fontSize: 14, color: COLORS.textLight },

//   // Chat Detail
//   msgBubble: { padding: 12, borderRadius: 16, maxWidth: '80%', marginBottom: 12 },
//   msgMe: { alignSelf: 'flex-end', backgroundColor: COLORS.primary },
//   msgThem: { alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
//   chatInputBar: { padding: 16, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
//   chatInput: { flex: 1, backgroundColor: COLORS.background, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, marginRight: 12 },

//   // Drawer
//   drawerHeader: { padding: 24, paddingTop: 48, backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderBottomColor: COLORS.border },
//   drawerAvatar: { width: 64, height: 64, borderRadius: 32, marginBottom: 12 },
//   drawerName: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
//   drawerEmail: { fontSize: 13, color: COLORS.textLight },
//   centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' }
// });


// import { Ionicons } from "@expo/vector-icons";
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList,
// } from "@react-navigation/drawer";
// import { useNavigation } from "@react-navigation/native";
// import * as ImagePicker from 'expo-image-picker';
// import React, { createContext, useContext, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";

// const { width } = Dimensions.get('window');

// // --- THEME COLORS ---
// const COLORS = {
//   primary: "#193648",       // Navy Blue
//   secondary: "#2C5364",     // Slate
//   accent: "#e8f0f5",        // Light Blue Background
//   background: "#F8F9FA",    // App Background
//   white: "#FFFFFF",
//   text: "#1F2937",
//   textLight: "#6B7280",
//   success: "#10B981",       // Active Green
//   border: "#E5E7EB",
//   danger: "#EF4444",
//   botBubble: "#E0F2FE",
//   userBubble: "#193648"
// };

// // --- DATA CONTEXT ---
// const DashboardContext = createContext<any>(null);

// const DashboardProvider = ({ children }: any) => {
//   // --- STATES ---
//   const [internships, setInternships] = useState([
//     {
//       id: 1,
//       title: "Frontend Developer Intern",
//       company: "Tech Solutions",
//       image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
//       skills: "React, TypeScript",
//       date: "2024-01-20",
//       applications: 45,
//       status: "Active"
//     },
//   ]);

//   const [projects, setProjects] = useState([
//     {
//       id: 1,
//       title: "AI Healthcare Diagnostics",
//       type: "Research",
//       image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
//       date: "2024-01-22",
//       applications: 23,
//       status: "Active"
//     },
//   ]);

//   const [mous, setMous] = useState([
//     {
//       id: 1,
//       university: "Riphah International University",
//       dept: "SE Department",
//       type: "Research Collaboration",
//       status: "Active",
//       startDate: "2023-11-15",
//       endDate: "2025-11-15",
//       duration: "2 Years"
//     },
//   ]);

//   const [userProfile, setUserProfile] = useState({
//     name: "Tech Solutions",
//     email: "hr@techsolutions.com",
//     logo: "https://ui-avatars.com/api/?name=Tech+Solutions&background=193648&color=fff&size=256",
//     industry: "Information Technology",
//     phone: "+92 300 1234567",
//     website: "https://techsolutions.com",
//     address: "Islamabad, Pakistan",
//     about: "We are a leading software house specializing in AI and Web Development."
//   });

//   // --- ACTIONS ---
//   const addInternship = (data: any) => {
//     const newInternship = { id: Date.now(), ...data, date: new Date().toISOString().split('T')[0], applications: 0, status: "Active" };
//     setInternships([newInternship, ...internships]);
//   };

//   const addProject = (data: any) => {
//     const newProject = { id: Date.now(), ...data, date: new Date().toISOString().split('T')[0], applications: 0, status: "Active" };
//     setProjects([newProject, ...projects]);
//   };

//   const addMoU = (data: any) => {
//     const today = new Date();
//     const endDate = new Date();
//     if (data.duration === '6 Months') endDate.setMonth(endDate.getMonth() + 6);
//     else if (data.duration === '1 Year') endDate.setFullYear(endDate.getFullYear() + 1);
//     else if (data.duration === '2 Years') endDate.setFullYear(endDate.getFullYear() + 2);
//     else endDate.setFullYear(endDate.getFullYear() + 5);

//     setMous([{ id: Date.now(), ...data, status: "Pending", startDate: today.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] }, ...mous]);
//   };

//   const updateProfile = (newData: any) => setUserProfile(newData);

//   return (
//     <DashboardContext.Provider value={{ internships, addInternship, projects, addProject, mous, addMoU, userProfile, updateProfile }}>
//       {children}
//     </DashboardContext.Provider>
//   );
// };

// // --- REUSABLE HEADER ---
// const Header = ({ title, back = false, actionIcon, onAction }: any) => {
//   const navigation = useNavigation<any>();
//   return (
//     <View style={styles.header}>
//       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//         <TouchableOpacity onPress={() => back ? navigation.goBack() : navigation.openDrawer()} style={styles.headerBtn}>
//           <Ionicons name={back ? "arrow-back" : "menu"} size={26} color={COLORS.primary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{title}</Text>
//       </View>
//       {actionIcon && (
//         <TouchableOpacity onPress={onAction} style={styles.headerBtn}>
//           <Ionicons name={actionIcon} size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// // --- SCREENS ---

// function HomeScreen() {
//   const navigation = useNavigation<any>();
//   const { internships, projects, mous, userProfile } = useContext(DashboardContext);

//   return (
//     <View style={styles.screenContainer}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
//       <View style={styles.header}>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <TouchableOpacity onPress={() => navigation.openDrawer()}>
//             <Image source={{ uri: userProfile.logo }} style={styles.headerAvatar} />
//           </TouchableOpacity>
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.greetingText}>Welcome back,</Text>
//             <Text style={styles.headerTitle}>{userProfile.name}</Text>
//           </View>
//         </View>
//         <TouchableOpacity onPress={() => navigation.navigate("AIChatbot")} style={styles.aiFab}>
//           <Ionicons name="sparkles" size={20} color={COLORS.white} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         <View style={styles.statsContainer}>
//           <View style={styles.statCard}>
//             <Text style={styles.statNumber}>{internships.length}</Text>
//             <Text style={styles.statLabel}>Internships</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statNumber}>{projects.length}</Text>
//             <Text style={styles.statLabel}>Projects</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statNumber}>{mous.length}</Text>
//             <Text style={styles.statLabel}>MoUs</Text>
//           </View>
//         </View>

//         <Text style={styles.sectionHeader}>Quick Actions</Text>
//         <View style={styles.actionGrid}>
//           <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("InternshipsMain")}>
//             <View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]}>
//               <Ionicons name="briefcase" size={28} color={COLORS.primary} />
//             </View>
//             <Text style={styles.actionTitle}>Internships</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("ManageProjects")}>
//             <View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]}>
//               <Ionicons name="flask" size={28} color={COLORS.primary} />
//             </View>
//             <Text style={styles.actionTitle}>Projects</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("MoUs")}>
//             <View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]}>
//               <Ionicons name="document-text" size={28} color={COLORS.primary} />
//             </View>
//             <Text style={styles.actionTitle}>MoUs</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // --- PROFILE SCREEN (Detailed & Functional) ---
// function ProfileScreen() {
//   const navigation = useNavigation();
//   const { userProfile, updateProfile } = useContext(DashboardContext);
//   const [loading, setLoading] = useState(false);

//   // Local State for Form
//   const [formData, setFormData] = useState({ ...userProfile });

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });
//     if (!result.canceled) {
//       setFormData({ ...formData, logo: result.assets[0].uri });
//     }
//   };

//   const handleSave = () => {
//     setLoading(true);
//     setTimeout(() => {
//       updateProfile(formData); // Update Global Context
//       setLoading(false);
//       Alert.alert("Success", "Profile updated successfully!");
//     }, 1000);
//   };

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Company Profile" back={true} />
//       <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

//         {/* Profile Header */}
//         <View style={styles.profileHeaderCard}>
//           <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
//             <Image source={{ uri: formData.logo }} style={styles.profileBigImage} />
//             <View style={styles.cameraBtn}>
//               <Ionicons name="camera" size={16} color="#fff" />
//             </View>
//           </TouchableOpacity>
//           <Text style={styles.profileName}>{formData.name}</Text>
//           <View style={styles.activeTag}>
//             <Text style={styles.activeTagText}>Verified Partner</Text>
//           </View>
//         </View>

//         {/* Form Sections */}
//         <View style={styles.formContainer}>
//           <Text style={styles.sectionHeader}>Company Information</Text>

//           <Text style={styles.formLabel}>Company Name</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.name}
//             onChangeText={(t) => setFormData({ ...formData, name: t })}
//           />

//           <Text style={styles.formLabel}>Industry Sector</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.industry}
//             onChangeText={(t) => setFormData({ ...formData, industry: t })}
//           />

//           <Text style={styles.formLabel}>Website</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.website}
//             onChangeText={(t) => setFormData({ ...formData, website: t })}
//             keyboardType="url"
//           />

//           <Text style={styles.formLabel}>About Us</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             value={formData.about}
//             onChangeText={(t) => setFormData({ ...formData, about: t })}
//             multiline
//             numberOfLines={4}
//           />

//           <Text style={styles.sectionHeader}>Contact Details</Text>

//           <Text style={styles.formLabel}>Email Address</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.email}
//             onChangeText={(t) => setFormData({ ...formData, email: t })}
//             keyboardType="email-address"
//           />

//           <Text style={styles.formLabel}>Phone Number</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.phone}
//             onChangeText={(t) => setFormData({ ...formData, phone: t })}
//             keyboardType="phone-pad"
//           />

//           <Text style={styles.formLabel}>Address</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.address}
//             onChangeText={(t) => setFormData({ ...formData, address: t })}
//           />

//           <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={loading}>
//             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Save Changes</Text>}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // --- MESSAGES SCREEN ---
// function MessagesScreen() {
//   const navigation = useNavigation<any>();
//   const [chats] = useState([
//     { id: 1, name: "Internship Incharge", subtitle: "Riphah International University", time: "10:30 AM", msg: "We have approved the research grant proposal.", avatar: "data:image/jpeg;base64,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", unread: 2 },
//     { id: 2, name: "Industry Liaison Incharge", subtitle: "Riphah International University", time: "Yesterday", msg: "When can we schedule the recruitment drive?", avatar: "data:image/jpeg;base64,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", unread: 0 },
//   ]);

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Messages" back={true} />
//       <FlatList
//         data={chats}
//         keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.chatListItem} onPress={() => navigation.navigate("ChatScreen", { contact: item })}>
//             <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
//             <View style={styles.chatContent}>
//               <View style={styles.chatRow}>
//                 <Text style={styles.chatName}>{item.name}</Text>
//                 <Text style={styles.chatTime}>{item.time}</Text>
//               </View>
//               <Text style={styles.chatSubtitle}>{item.subtitle}</Text>
//               <View style={styles.chatRow}>
//                 <Text style={[styles.chatMsg, item.unread > 0 && { fontWeight: 'bold', color: COLORS.text }]} numberOfLines={1}>{item.msg}</Text>
//                 {item.unread > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{item.unread}</Text></View>}
//               </View>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// function ChatScreen({ route }: any) {
//   const navigation = useNavigation();
//   const { contact } = route.params || { contact: { name: "industry Laison Incharge", avatar: "https://ui-avatars.com/api/?name=Uni" } };
//   const [messages, setMessages] = useState([{ id: 1, text: "Hello! How can we help you?", sender: "them", time: "10:00 AM" }]);
//   const [input, setInput] = useState("");
//   const flatListRef = useRef<FlatList>(null);

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     const newMsg = { id: Date.now(), text: input, sender: "me", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
//     setMessages(prev => [...prev, newMsg]);
//     setInput("");
//     setTimeout(() => {
//       setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sure, let me check.", sender: "them", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
//     }, 1500);
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screenContainer}>
//       <View style={styles.chatHeader}>
//         <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.primary} /></TouchableOpacity>
//         <Image source={{ uri: contact.avatar }} style={styles.chatHeaderAvatar} />
//         <View><Text style={styles.chatHeaderName}>{contact.name}</Text><Text style={styles.chatHeaderStatus}>Online</Text></View>
//       </View>
//       <FlatList
//         ref={flatListRef} data={messages} keyExtractor={item => item.id.toString()} contentContainerStyle={{ padding: 16 }}
//         onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
//         renderItem={({ item }) => (
//           <View style={[styles.msgBubble, item.sender === "me" ? styles.msgMe : styles.msgThem]}>
//             <Text style={item.sender === "me" ? styles.msgTextMe : styles.msgTextThem}>{item.text}</Text>
//             <Text style={styles.msgTime}>{item.time}</Text>
//           </View>
//         )}
//       />
//       <View style={styles.inputArea}>
//         <TextInput style={styles.chatInput} placeholder="Type a message..." value={input} onChangeText={setInput} />
//         <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}><Ionicons name="send" size={20} color={COLORS.white} /></TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // --- AI CHATBOT SCREEN ---
// function AIChatbotScreen() {
//   const navigation = useNavigation();
//   const [messages, setMessages] = useState([{ id: 1, text: "Hello! I am your Industry CXbot. How can I help?", sender: "bot" }]);
//   const [typing, setTyping] = useState(false);
//   const [input, setInput] = useState("");
//   const flatListRef = useRef<FlatList>(null);

//   const handleSend = (text: string) => {
//     if (!text.trim()) return;
//     setMessages(prev => [...prev, { id: Date.now(), text, sender: "user" }]);
//     setInput("");
//     setTyping(true);
//     setTimeout(() => {
//       let botReply = "I can help with that. Please provide more details.";
//       if (text.includes("Internship")) botReply = "To draft an internship, I need Job Title and Skills.";
//       setMessages(prev => [...prev, { id: Date.now() + 1, text: botReply, sender: "bot" }]);
//       setTyping(false);
//     }, 2000);
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screenContainer}>
//       <Header title="CXbot" back={true} />
//       <FlatList
//         ref={flatListRef} data={messages} keyExtractor={item => item.id.toString()} contentContainerStyle={{ padding: 16 }}
//         onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
//         renderItem={({ item }) => (
//           <View style={[styles.aiBubble, item.sender === "user" ? styles.aiUser : styles.aiBot]}>
//             {item.sender === 'bot' && <View style={styles.aiIcon}><Ionicons name="sparkles" size={14} color={COLORS.white} /></View>}
//             <Text style={item.sender === "user" ? styles.aiUserText : styles.aiBotText}>{item.text}</Text>
//           </View>
//         )}
//         ListFooterComponent={typing ? <Text style={{ marginLeft: 20, color: COLORS.textLight }}>AI is typing...</Text> : null}
//       />
//       <View style={styles.inputArea}>
//         <TextInput style={styles.chatInput} placeholder="Ask CXbot anything..." value={input} onChangeText={setInput} />
//         <TouchableOpacity style={[styles.sendBtn, { backgroundColor: COLORS.secondary }]} onPress={() => handleSend(input)}><Ionicons name="arrow-up" size={24} color={COLORS.white} /></TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // --- OTHER SCREENS (Internships, Projects, MoUs) ---
// function InternshipsMainScreen() {
//   const navigation = useNavigation<any>();
//   const { internships } = useContext(DashboardContext);
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Internships" back={true} />
//       <ScrollView contentContainerStyle={{ padding: 16 }}>
//         <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("PostNewInternship")}><Ionicons name="add-circle" size={24} color={COLORS.white} /><Text style={styles.createButtonText}>Post New Internship</Text></TouchableOpacity>
//         <Text style={styles.sectionHeader}>Active Listings</Text>
//         {internships.map((item: any) => (
//           <View key={item.id} style={styles.jobCard}>
//             <Image source={{ uri: item.image }} style={styles.jobCardImage} />
//             <View style={styles.jobCardContent}>
//               <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={styles.jobCardTitle}>{item.title}</Text><View style={styles.activeTag}><Text style={styles.activeTagText}>Active</Text></View></View>
//               <Text style={styles.jobCardCompany}>{item.company}</Text>
//               <View style={styles.jobFooter}><Text style={styles.jobDate}>Posted: {item.date}</Text><Text style={styles.jobApps}>{item.applications} Applicants</Text></View>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   )
// }

// function PostNewInternshipScreen() {
//   const navigation = useNavigation();
//   const { addInternship } = useContext(DashboardContext);
//   const [title, setTitle] = useState("");
//   const [skills, setSkills] = useState("");
//   const [desc, setDesc] = useState("");
//   const [image, setImage] = useState<string | null>(null);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [16, 9], quality: 1 });
//     if (!result.canceled) setImage(result.assets[0].uri);
//   };
//   return (
//     <ScrollView style={styles.screenContainer}>
//       <Header title="New Internship" back={true} />
//       <View style={styles.formContainer}>
//         <TouchableOpacity style={styles.bannerUpload} onPress={pickImage}>
//           {image ? <Image source={{ uri: image }} style={styles.uploadedBanner} /> : <View style={styles.uploadPlaceholder}><Ionicons name="image-outline" size={40} color={COLORS.textLight} /><Text style={styles.uploadText}>Upload Cover Image</Text></View>}
//         </TouchableOpacity>
//         <Text style={styles.formLabel}>Job Title</Text><TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. React Developer" />
//         <Text style={styles.formLabel}>Skills</Text><TextInput style={styles.input} value={skills} onChangeText={setSkills} placeholder="e.g. JavaScript" />
//         <Text style={styles.formLabel}>Details</Text><TextInput style={[styles.input, styles.textArea]} value={desc} onChangeText={setDesc} placeholder="Responsibilities..." multiline />
//         <TouchableOpacity style={styles.primaryButton} onPress={() => { addInternship({ title, company: "Tech Solutions", skills, image: image || "https://via.placeholder.com/600", description: desc }); navigation.goBack() }}><Text style={styles.primaryButtonText}>Publish</Text></TouchableOpacity>
//       </View>
//     </ScrollView>
//   )
// }

// function MoUScreen() {
//   const navigation = useNavigation<any>();
//   const { mous } = useContext(DashboardContext);
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="MoUs" back={true} />
//       <View style={{ padding: 16, paddingBottom: 0 }}>
//         <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateMoU')}><Ionicons name="add-circle" size={22} color={COLORS.white} /><Text style={styles.createButtonText}>Request New MoU</Text></TouchableOpacity>
//       </View>
//       <FlatList data={mous} keyExtractor={item => item.id.toString()} contentContainerStyle={{ padding: 16 }} renderItem={({ item }) => (
//         <View style={styles.mouCard}>
//           <View style={styles.mouHeader}><Text style={styles.mouUni}>{item.university}</Text><View style={styles.activeTag}><Text style={styles.activeTagText}>{item.status}</Text></View></View>
//           <Text style={styles.mouDept}>{item.dept}</Text>
//           <Text style={styles.mouType}>{item.type}</Text>
//           <View style={styles.mouFooter}><Text style={styles.dateLabel}>Ends: {item.endDate}</Text></View>
//         </View>
//       )} />
//     </View>
//   );
// }

// function CreateMoUScreen() {
//   const navigation = useNavigation();
//   const { addMoU } = useContext(DashboardContext);
//   const [dept, setDept] = useState('');
//   const [type, setType] = useState('');
//   const [duration, setDuration] = useState('1 Year');
//   return (
//     <ScrollView style={styles.screenContainer}>
//       <Header title="Request MoU" back={true} />
//       <View style={styles.formContainer}>
//         <Text style={styles.formLabel}>University</Text><TextInput style={[styles.input, { backgroundColor: '#F3F4F6' }]} value="Riphah Int. University" editable={false} />
//         <Text style={styles.formLabel}>Department</Text><TextInput style={styles.input} placeholder="e.g. SE Dept" value={dept} onChangeText={setDept} />
//         <Text style={styles.formLabel}>Type</Text><TextInput style={styles.input} placeholder="e.g. Research" value={type} onChangeText={setType} />
//         <Text style={styles.formLabel}>Duration</Text>
//         <View style={{ flexDirection: 'row', gap: 10 }}>{['1 Year', '2 Years'].map(d => <TouchableOpacity key={d} onPress={() => setDuration(d)} style={[styles.durationBtn, duration === d && styles.durationBtnActive]}><Text style={duration === d ? styles.durationTextActive : styles.durationText}>{d}</Text></TouchableOpacity>)}</View>
//         <TouchableOpacity style={styles.primaryButton} onPress={() => { addMoU({ university: "Riphah", dept, type, duration }); navigation.goBack() }}><Text style={styles.primaryButtonText}>Create MoU</Text></TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// function ManageProjects() {
//   const navigation = useNavigation();
//   const { projects } = useContext(DashboardContext);
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Projects" back={true} />
//       <ScrollView contentContainerStyle={{ padding: 16 }}>
//         <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("PostNewProject" as any)}><Ionicons name="add" size={24} color="#fff" /><Text style={styles.createButtonText}>Add New Project</Text></TouchableOpacity>
//         {projects.map((item: any) => (<View key={item.id} style={styles.jobCard}><Image source={{ uri: item.image }} style={styles.jobCardImage} /><View style={styles.jobCardContent}><Text style={styles.jobCardTitle}>{item.title}</Text><Text style={styles.jobCardCompany}>{item.type}</Text></View></View>))}
//       </ScrollView>
//     </View>
//   )
// }

// function PostNewProjectScreen() {
//   const navigation = useNavigation();
//   const { addProject } = useContext(DashboardContext);
//   const [title, setTitle] = useState("");
//   return (
//     <ScrollView style={styles.screenContainer}>
//       <Header title="New Project" back={true} />
//       <View style={styles.formContainer}>
//         <Text style={styles.formLabel}>Title</Text><TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Project Title" />
//         <TouchableOpacity style={styles.primaryButton} onPress={() => { addProject({ title, type: "Research", image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b" }); navigation.goBack(); }}><Text style={styles.primaryButtonText}>Save Project</Text></TouchableOpacity>
//       </View>
//     </ScrollView>
//   )
// }

// // --- DRAWER ---
// function CustomDrawer(props: any) {
//   const { userProfile } = useContext(DashboardContext);
//   const navigation = useNavigation<any>();
//   return (
//     <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: COLORS.white, flex: 1 }}>
//       <View style={styles.drawerHeader}>
//         <Image source={{ uri: userProfile.logo }} style={styles.drawerAvatarLarge} />
//         <View><Text style={styles.drawerName}>{userProfile.name}</Text><Text style={styles.drawerEmail}>Industry Partner</Text></View>
//       </View>
//       <View style={{ flex: 1, paddingTop: 10 }}><DrawerItemList {...props} activeBackgroundColor={COLORS.accent} activeTintColor={COLORS.primary} inactiveTintColor={COLORS.textLight} itemStyle={{ borderRadius: 8, marginHorizontal: 8 }} /></View>
//       <TouchableOpacity
//         style={styles.logoutBtn}
//         onPress={() =>
//           Alert.alert(
//             "Logout",
//             "Are you sure you want to logout?",
//             [
//               {
//                 text: "Cancel",
//                 style: "cancel"
//               },
//               {
//                 text: "Yes",
//                 onPress: () => navigation.navigate("IndustryLogin")
//               }
//             ]
//           )
//         }
//       >
//         <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
//         <Text style={styles.logoutText}>Sign Out</Text>
//       </TouchableOpacity>
//     </DrawerContentScrollView>
//   );
// }

// // --- NAVIGATION ---
// const Drawer = createDrawerNavigator();
// const MainApp = () => (
//   <DashboardProvider>
//     <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{ headerShown: false, drawerActiveTintColor: '#193648ce', drawerLabelStyle: { fontSize: 15, marginLeft: -3 } }}>
//       <Drawer.Screen name="Dashboard" component={HomeScreen} options={{ drawerIcon: ({ color }) => <Ionicons name="grid-outline" size={22} color={color} /> }} />
//       <Drawer.Screen name="InternshipsMain" component={InternshipsMainScreen} options={{ title: 'Internships', drawerIcon: ({ color }) => <Ionicons name="briefcase-outline" size={22} color={color} /> }} />
//       <Drawer.Screen name="ManageProjects" component={ManageProjects} options={{ title: 'Projects', drawerIcon: ({ color }) => <Ionicons name="flask-outline" size={22} color={color} /> }} />
//       <Drawer.Screen name="MoUs" component={MoUScreen} options={{ title: 'MoUs', drawerIcon: ({ color }) => <Ionicons name="document-text-outline" size={22} color={color} /> }} />
//       <Drawer.Screen name="MessagesMain" component={MessagesScreen} options={{ title: 'Messages', drawerIcon: ({ color }) => <Ionicons name="chatbubbles-outline" size={22} color={color} /> }} />
//       <Drawer.Screen name="Profile" component={ProfileScreen} options={{ drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} /> }} />
//       <Drawer.Screen name="AIChatbot" component={AIChatbotScreen} options={{ title: 'CXbot', drawerIcon: ({ color }) => <Ionicons name="sparkles-outline" size={22} color={color} /> }} />
//       <Drawer.Screen name="CreateMoU" component={CreateMoUScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//       <Drawer.Screen name="PostNewInternship" component={PostNewInternshipScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//       <Drawer.Screen name="PostNewProject" component={PostNewProjectScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//       <Drawer.Screen name="ChatScreen" component={ChatScreen} options={{ drawerItemStyle: { display: 'none' } }} />
//     </Drawer.Navigator>
//   </DashboardProvider>
// );

// export default function App() { return <MainApp />; }

// // --- STYLES ---
// const styles = StyleSheet.create({
//   screenContainer: { flex: 1, backgroundColor: COLORS.background },
//   scrollContent: { padding: 20, paddingBottom: 50 },
//   header: { backgroundColor: COLORS.white, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
//   headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
//   greetingText: { fontSize: 12, color: COLORS.textLight },
//   headerAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
//   headerBtn: { padding: 4 },
//   aiFab: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 5 },

//   // Dashboard
//   statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
//   statCard: { flex: 1, backgroundColor: COLORS.white, padding: 16, borderRadius: 12, marginHorizontal: 5, alignItems: 'center', elevation: 2 },
//   statNumber: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
//   statLabel: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
//   sectionHeader: { fontSize: 18, fontWeight: '700', color: COLORS.primary, marginBottom: 16, marginLeft: 4 },
//   actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
//   actionCard: { flex: 1, minWidth: '30%', backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: 'center', elevation: 2, marginBottom: 10 },
//   actionIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
//   actionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'center' },

//   // Forms
//   formContainer: { padding: 20 },
//   formLabel: { fontSize: 14, fontWeight: '600', color: COLORS.primary, marginBottom: 8, marginTop: 16 },
//   input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, color: COLORS.text },
//   textArea: { textAlignVertical: 'top', height: 100 },
//   primaryButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
//   primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
//   createButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, padding: 14, borderRadius: 12, marginBottom: 16 },
//   createButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },

//   // Image Upload
//   bannerUpload: { width: '100%', height: 180, backgroundColor: '#E5E7EB', borderRadius: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#D1D5DB', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
//   uploadPlaceholder: { alignItems: 'center' },
//   uploadText: { marginTop: 8, color: COLORS.textLight, fontWeight: '500' },
//   uploadedBanner: { width: '100%', height: '100%' },

//   // Duration
//   durationBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
//   durationBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   durationText: { fontSize: 12, color: COLORS.text },
//   durationTextActive: { color: COLORS.white, fontWeight: '600' },

//   // Cards
//   jobCard: { backgroundColor: COLORS.white, borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 2 },
//   jobCardImage: { width: '100%', height: 120 },
//   jobCardContent: { padding: 16 },
//   jobCardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
//   jobCardCompany: { fontSize: 13, color: COLORS.textLight, marginBottom: 8 },
//   activeTag: { backgroundColor: '#DEF7EC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
//   activeTagText: { color: COLORS.success, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
//   jobFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#F3F4F6', paddingTop: 12, marginTop: 12 },
//   jobDate: { fontSize: 12, color: '#9CA3AF' },
//   jobApps: { fontSize: 12, fontWeight: '600', color: COLORS.primary },

//   // MoU Cards
//   mouCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 },
//   mouHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
//   mouUni: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, flex: 1 },
//   mouDept: { fontSize: 13, color: COLORS.secondary, fontWeight: '600', marginTop: 2 },
//   mouType: { fontSize: 14, color: COLORS.textLight },
//   mouFooter: { marginTop: 10, borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 },
//   dateLabel: { fontSize: 12, color: '#666' },

//   // Profile Specific
//   profileHeaderCard: { backgroundColor: COLORS.white, padding: 20, alignItems: 'center', borderBottomWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
//   imageWrapper: { position: 'relative', marginBottom: 15 },
//   profileBigImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: COLORS.accent },
//   cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
//   profileName: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },

//   // MESSAGES
//   chatListItem: { flexDirection: 'row', padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: '#f0f0f0' },
//   chatAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
//   chatContent: { flex: 1, justifyContent: 'center' },
//   chatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   chatName: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
//   chatTime: { fontSize: 12, color: COLORS.textLight },
//   chatSubtitle: { fontSize: 12, color: COLORS.secondary, marginBottom: 2 },
//   chatMsg: { fontSize: 14, color: COLORS.textLight, flex: 1 },
//   unreadBadge: { backgroundColor: COLORS.primary, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
//   unreadText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
//   chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 40, backgroundColor: COLORS.white, elevation: 2 },
//   chatHeaderAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 12 },
//   chatHeaderName: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
//   chatHeaderStatus: { fontSize: 12, color: COLORS.success },
//   msgBubble: { padding: 12, borderRadius: 16, maxWidth: '80%', marginBottom: 10 },
//   msgMe: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderBottomRightRadius: 2 },
//   msgThem: { alignSelf: 'flex-start', backgroundColor: '#e5e5e5', borderBottomLeftRadius: 2 },
//   msgTextMe: { color: 'white' },
//   msgTextThem: { color: COLORS.text },
//   msgTime: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
//   inputArea: { flexDirection: 'row', padding: 10, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: '#eee', alignItems: 'center' },
//   chatInput: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
//   sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },

//   // AI Chat
//   aiBubble: { padding: 14, borderRadius: 16, maxWidth: '85%', marginBottom: 12 },
//   aiBot: { alignSelf: 'flex-start', backgroundColor: COLORS.botBubble, borderTopLeftRadius: 2 },
//   aiUser: { alignSelf: 'flex-end', backgroundColor: COLORS.userBubble, borderTopRightRadius: 2 },
//   aiIcon: { marginBottom: 6, backgroundColor: COLORS.primary, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
//   aiBotText: { color: COLORS.text },
//   aiUserText: { color: COLORS.white },

//   // Drawer
//   drawerHeader: { padding: 24, paddingTop: 60, paddingBottom: 24, backgroundColor: '#193648ff', alignItems: 'center', flexDirection: 'row', borderRadius: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border },
//   drawerAvatarLarge: { width: 80, height: 80, borderRadius: 50, borderWidth: 1, borderColor: COLORS.border, marginRight: 16 },
//   drawerName: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
//   drawerEmail: { fontSize: 12, color: COLORS.textLight },
//   logoutBtn: { flexDirection: 'row', alignItems: 'center', padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border },
//   logoutText: { color: COLORS.danger, fontWeight: '600', marginLeft: 12 },
// });























// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList,
// } from "@react-navigation/drawer";
// import { useNavigation } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import * as ImagePicker from "expo-image-picker";
// import React, {
//   createContext, useCallback, useContext,
//   useEffect, useRef, useState
// } from "react";
// import {
//   ActivityIndicator, Alert, Animated, Dimensions,
//   FlatList, Image, KeyboardAvoidingView,
//   Modal, Platform, RefreshControl, ScrollView,
//   StatusBar, StyleSheet, Text, TextInput,
//   TouchableOpacity, View
// } from "react-native";
// import axios from "axios";

// const { width } = Dimensions.get("window");

// // ─── THEME COLORS (آپ کے original رنگ) ──────────────────────────
// const COLORS = {
//   primary:    "#193648",
//   secondary:  "#2C5364",
//   accent:     "#e8f0f5",
//   background: "#F8F9FA",
//   white:      "#FFFFFF",
//   text:       "#1F2937",
//   textLight:  "#6B7280",
//   success:    "#10B981",
//   border:     "#E5E7EB",
//   danger:     "#EF4444",
//   botBubble:  "#E0F2FE",
//   userBubble: "#193648",
//   gold:       "#C9A84C",
// };

// // ─── BACKEND CONFIG ───────────────────────────────────────────────
// const BASE_URL = "http://localhost:${PORT}"; // ← آپ کا server
// const API_AUTH = `${BASE_URL}/api/industry/auth`;
// const API_MOUS = `${BASE_URL}/api/industry/mous`;
// const API_INT  = `${BASE_URL}/api/industry/internships`;
// const API_PROJ = `${BASE_URL}/api/industry/projects`;

// // ─── HELPERS ──────────────────────────────────────────────────────
// const fmtDate = (d?: string | null) => {
//   if (!d) return "—";
//   try { return new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }); }
//   catch { return d; }
// };
// const fmtDT = (d?: string | null) => {
//   if (!d) return "—";
//   try { return new Date(d).toLocaleString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
//   catch { return d; }
// };

// // MOU status config
// const SC: Record<string, { c: string; bg: string; lbl: string }> = {
//   Draft:                    { c: "#64748b", bg: "#f1f5f9", lbl: "Draft" },
//   "dSent to Inustry":       { c: "#d97706", bg: "#fffbeb", lbl: "Sent to Us" },
//   "Changes Proposed":       { c: "#7c3aed", bg: "#f5f3ff", lbl: "Changes Proposed" },
//   "Industry Responded":     { c: "#0891b2", bg: "#ecfeff", lbl: "Responded" },
//   "Approved by Industry":   { c: "#059669", bg: "#ecfdf5", lbl: "We Approved ✓" },
//   "Approved by University": { c: "#0284c7", bg: "#e0f2fe", lbl: "Uni Approved" },
//   "Mutually Approved":      { c: "#16a34a", bg: "#dcfce7", lbl: "Mutually Approved ✓" },
//   Rejected:                 { c: "#dc2626", bg: "#fef2f2", lbl: "Rejected" },
// };
// const CT: Record<string, { c: string; bg: string; ic: string; lbl: string }> = {
//   industry_change:    { c: "#7c3aed", bg: "#f5f3ff", ic: "🏭", lbl: "Industry Changed" },
//   industry_approve:   { c: "#059669", bg: "#ecfdf5", ic: "✅", lbl: "Industry Approved" },
//   industry_reject:    { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Industry Rejected" },
//   industry_response:  { c: "#0891b2", bg: "#ecfeff", ic: "💬", lbl: "Industry Response" },
//   university_change:  { c: "#0284c7", bg: "#e0f2fe", ic: "🎓", lbl: "University Changed" },
//   university_approve: { c: "#16a34a", bg: "#dcfce7", ic: "✅", lbl: "Uni Approved" },
//   university_reject:  { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Uni Rejected" },
//   meeting_proposed:   { c: "#7c3aed", bg: "#f5f3ff", ic: "📅", lbl: "Meeting Proposed" },
//   meeting_confirmed:  { c: "#16a34a", bg: "#dcfce7", ic: "🤝", lbl: "Meeting Confirmed" },
// };

// const normMou = (m: any) => {
//   if (!m) return m;
//   const cs = m.meetingConfirmedSlot, ip = m.meetingIndustryProposedSlot;
//   return {
//     ...m,
//     meetingConfirmedSlot:        cs?.date ? { date: cs.date, time: cs.time || "", note: cs.note || "" } : null,
//     meetingConfirmedAt:          cs?.date ? m.meetingConfirmedAt : null,
//     meetingIndustryProposedSlot: ip?.date ? { date: ip.date, time: ip.time || "", note: ip.note || "" } : null,
//     meetingIndustryProposedAt:   ip?.date ? m.meetingIndustryProposedAt : null,
//   };
// };
// const bldPayload = (m: any) => ({
//   title: m.title, university: m.university, industry: m.industry, industryId: m.industryId,
//   collaborationType: m.collaborationType, startDate: m.startDate, endDate: m.endDate,
//   description: m.description, objectives: m.objectives || [], responsibilities: m.responsibilities,
//   terms: m.terms || [], signatories: m.signatories, universityContact: m.universityContact,
//   industryContact: m.industryContact, universityLogo: m.universityLogo || "", industryLogo: m.industryLogo || "",
//   status: m.status, universityStamp: m.universityStamp, industryStamp: m.industryStamp,
//   sentAt: m.sentAt, industryResponseAt: m.industryResponseAt,
//   proposedChanges: m.proposedChanges || [], changeLog: m.changeLog || [],
//   scheduledMeeting: m.scheduledMeeting || null,
//   meetingConfirmedSlot: m.meetingConfirmedSlot || null, meetingConfirmedAt: m.meetingConfirmedAt || null,
//   meetingIndustryProposedSlot: m.meetingIndustryProposedSlot || null,
//   meetingIndustryProposedAt: m.meetingIndustryProposedAt || null,
// });
// const addCL = (m: any, type: string, data: any = {}) =>
//   [...(m.changeLog || []), { id: Date.now(), type, date: new Date().toISOString(), ...data }];

// // ─── CollaXion LOGO ───────────────────────────────────────────────
// const CXLogo = ({ size = 28, inv = false }: { size?: number; inv?: boolean }) => (
//   <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
//     <View style={{ width: size, height: size, borderRadius: size * 0.22,
//       backgroundColor: inv ? "#fff" : COLORS.primary, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: size * 0.46, fontWeight: "900", color: inv ? COLORS.primary : "#fff" }}>CX</Text>
//     </View>
//     <Text style={{ fontSize: size * 0.56, fontWeight: "800", color: inv ? "#fff" : COLORS.primary }}>
//       Colla<Text style={{ color: COLORS.gold }}>X</Text>ion
//     </Text>
//   </View>
// );

// // ─── STATUS BADGE ─────────────────────────────────────────────────
// const SBadge = ({ status }: { status: string }) => {
//   const c = SC[status] || { c: COLORS.textLight, bg: COLORS.accent, lbl: status };
//   return (
//     <View style={[styles.statusBadge, { backgroundColor: c.bg }]}>
//       <Text style={[styles.statusText, { color: c.c }]}>{c.lbl}</Text>
//     </View>
//   );
// };

// // ─── AUTH CONTEXT ─────────────────────────────────────────────────
// const AuthCtx = createContext<any>(null);
// const useAuth  = () => useContext(AuthCtx);

// const AuthProvider = ({ children }: any) => {
//   const [user,  setUser]  = useState<any>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const t = await AsyncStorage.getItem("cx_t");
//       const u = await AsyncStorage.getItem("cx_u");
//       if (t && u) { setToken(t); setUser(JSON.parse(u)); }
//       setReady(true);
//     })();
//   }, []);

//   const ax = useCallback(() =>
//     axios.create({ headers: { Authorization: `Bearer ${token}` } }), [token]);

//   const login = async (email: string, password: string) => {
//     const r = await axios.post(`${API_AUTH}/login`, { email, password });
//     await AsyncStorage.setItem("cx_t", r.data.token);
//     await AsyncStorage.setItem("cx_u", JSON.stringify(r.data.user));
//     setToken(r.data.token); setUser(r.data.user);
//   };
//   const register = async (data: any) => {
//     const r = await axios.post(`${API_AUTH}/register`, data);
//     await AsyncStorage.setItem("cx_t", r.data.token);
//     await AsyncStorage.setItem("cx_u", JSON.stringify(r.data.user));
//     setToken(r.data.token); setUser(r.data.user);
//   };
//   const logout = async () => {
//     await AsyncStorage.multiRemove(["cx_t", "cx_u"]);
//     setToken(null); setUser(null);
//   };
//   // updateUser → profile image change → auto sync drawer + home
//   const updateUser = async (data: any) => {
//     const r = await ax().put(`${API_AUTH}/profile`, data);
//     await AsyncStorage.setItem("cx_u", JSON.stringify(r.data));
//     setUser(r.data); return r.data;
//   };

//   return (
//     <AuthCtx.Provider value={{ user, token, ready, login, register, logout, updateUser, ax }}>
//       {children}
//     </AuthCtx.Provider>
//   );
// };

// // ─── TOAST ────────────────────────────────────────────────────────
// const ToastCtx = createContext<any>(null);
// const useToast = () => useContext(ToastCtx);

// const ToastProvider = ({ children }: any) => {
//   const [t, setT] = useState<any>(null);
//   const a = useRef(new Animated.Value(0)).current;
//   const show = (msg: string, type = "info") => {
//     setT({ msg, type });
//     Animated.sequence([
//       Animated.timing(a, { toValue: 1, duration: 260, useNativeDriver: true }),
//       Animated.delay(2700),
//       Animated.timing(a, { toValue: 0, duration: 260, useNativeDriver: true }),
//     ]).start(() => setT(null));
//   };
//   const bg  = t?.type === "success" ? "#dcfce7" : t?.type === "error" ? "#fef2f2" : "#eff6ff";
//   const clr = t?.type === "success" ? "#166534" : t?.type === "error" ? "#991b1b" : "#1e40af";
//   return (
//     <ToastCtx.Provider value={show}>
//       {children}
//       {t && (
//         <Animated.View style={[styles.toast, { backgroundColor: bg, borderColor: clr + "50",
//           opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }] }]}>
//           <Ionicons name={t.type === "success" ? "checkmark-circle" : "information-circle"} size={16} color={clr} />
//           <Text style={[styles.toastTxt, { color: clr }]}>{t.msg}</Text>
//         </Animated.View>
//       )}
//     </ToastCtx.Provider>
//   );
// };

// // ─── REUSABLE HEADER (آپ کے original جیسا) ───────────────────────
// const Header = ({ title, back = false, actionIcon, onAction }: any) => {
//   const navigation = useNavigation<any>();
//   return (
//     <View style={styles.header}>
//       <View style={{ flexDirection: "row", alignItems: "center" }}>
//         <TouchableOpacity
//           onPress={() => back ? navigation.goBack() : navigation.openDrawer()}
//           style={styles.headerBtn}>
//           <Ionicons name={back ? "arrow-back" : "menu"} size={26} color={COLORS.primary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{title}</Text>
//       </View>
//       {actionIcon && (
//         <TouchableOpacity onPress={onAction} style={styles.headerBtn}>
//           <Ionicons name={actionIcon} size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// //  LOGIN SCREEN
// // ═══════════════════════════════════════════════════════════════
// function LoginScreen() {
//   const nav = useNavigation<any>();
//   const { login } = useAuth();
//   const toast = useToast();
//   const [email, setEmail]  = useState("");
//   const [pass,  setPass]   = useState("");
//   const [show,  setShow]   = useState(false);
//   const [ld,    setLd]     = useState(false);

//   const go = async () => {
//     if (!email || !pass) { toast("Fill all fields", "error"); return; }
//     setLd(true);
//     try { await login(email, pass); }
//     catch (e: any) { toast(e?.response?.data?.message || "Login failed", "error"); }
//     finally { setLd(false); }
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.authBg}>
//       <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
//       <View style={styles.authTop}>
//         <CXLogo size={32} inv />
//         <Text style={styles.authTagline}>Industry Partner Portal</Text>
//       </View>
//       <View style={styles.authCard}>
//         <Text style={styles.authTitle}>Welcome Back</Text>
//         <Text style={styles.authSub}>Sign in to your account</Text>

//         <Text style={styles.formLabel}>Email Address</Text>
//         <TextInput style={styles.input} value={email} onChangeText={setEmail}
//           keyboardType="email-address" autoCapitalize="none"
//           placeholder="hr@company.com" placeholderTextColor={COLORS.textLight} />

//         <Text style={styles.formLabel}>Password</Text>
//         <View style={styles.passWrap}>
//           <TextInput style={{ flex: 1, fontSize: 15, color: COLORS.text }}
//             value={pass} onChangeText={setPass} secureTextEntry={!show}
//             placeholder="••••••••" placeholderTextColor={COLORS.textLight} />
//           <TouchableOpacity onPress={() => setShow(!show)} style={{ padding: 4 }}>
//             <Ionicons name={show ? "eye-off" : "eye"} size={17} color={COLORS.textLight} />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity style={[styles.primaryButton, ld && { opacity: 0.7 }]} onPress={go} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : (
//             <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//               <Ionicons name="log-in-outline" size={16} color="#fff" />
//               <Text style={styles.primaryButtonText}>Sign In</Text>
//             </View>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.authLink} onPress={() => nav.navigate("Register")}>
//           <Text style={styles.authLinkTxt}>
//             Don't have an account? <Text style={{ color: COLORS.primary, fontWeight: "700" }}>Register</Text>
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  REGISTER SCREEN
// // ═══════════════════════════════════════════════════════════════
// function RegisterScreen() {
//   const nav = useNavigation<any>();
//   const { register } = useAuth();
//   const toast = useToast();
//   const [f,    setF]    = useState({ name: "", email: "", password: "", industry: "", phone: "", website: "", address: "" });
//   const [logo, setLogo] = useState("");
//   const [ld,   setLd]   = useState(false);

//   const pickLogo = async () => {
//     const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7 });
//     if (!r.canceled) setLogo(r.assets[0].uri);
//   };

//   const go = async () => {
//     if (!f.name || !f.email || !f.password) { toast("Name, email & password required", "error"); return; }
//     setLd(true);
//     try { await register({ ...f, logo }); }
//     catch (e: any) { toast(e?.response?.data?.message || "Registration failed", "error"); }
//     finally { setLd(false); }
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.authBg}>
//       <StatusBar barStyle="light-content" />
//       <View style={[styles.authTop, { paddingBottom: 14 }]}><CXLogo size={26} inv /></View>
//       <ScrollView style={styles.authCard} contentContainerStyle={{ paddingBottom: 36 }}>
//         <Text style={styles.authTitle}>Create Account</Text>
//         <Text style={styles.authSub}>Register as Industry Partner</Text>

//         <TouchableOpacity style={styles.logoPicker} onPress={pickLogo}>
//           {logo ? <Image source={{ uri: logo }} style={{ width: "100%", height: "100%" }} /> : (
//             <View style={{ alignItems: "center", gap: 4 }}>
//               <Ionicons name="camera" size={24} color={COLORS.textLight} />
//               <Text style={{ fontSize: 11, color: COLORS.textLight }}>Company Logo</Text>
//             </View>
//           )}
//         </TouchableOpacity>

//         {[
//           { lbl: "Company Name *", key: "name",     ph: "Tech Solutions" },
//           { lbl: "Email *",        key: "email",    ph: "hr@company.com", kb: "email-address" as any },
//           { lbl: "Password *",     key: "password", ph: "Min 6 chars", sec: true },
//           { lbl: "Industry",       key: "industry", ph: "Information Technology" },
//           { lbl: "Phone",          key: "phone",    ph: "+92 300 0000000", kb: "phone-pad" as any },
//           { lbl: "Website",        key: "website",  ph: "https://company.com", kb: "url" as any },
//           { lbl: "Address",        key: "address",  ph: "City, Pakistan" },
//         ].map(({ lbl, key, ph, kb, sec }) => (
//           <View key={key}>
//             <Text style={styles.formLabel}>{lbl}</Text>
//             <TextInput style={styles.input} placeholder={ph} placeholderTextColor={COLORS.textLight}
//               value={(f as any)[key]} onChangeText={(v: string) => setF({ ...f, [key]: v })}
//               keyboardType={kb || "default"} secureTextEntry={!!sec} autoCapitalize="none" />
//           </View>
//         ))}

//         <TouchableOpacity style={[styles.primaryButton, ld && { opacity: 0.7 }]} onPress={go} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Create Account</Text>}
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.authLink} onPress={() => nav.goBack()}>
//           <Text style={styles.authLinkTxt}>Have account? <Text style={{ color: COLORS.primary, fontWeight: "700" }}>Sign In</Text></Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  HOME SCREEN (آپ کا original structure + backend)
// // ═══════════════════════════════════════════════════════════════
// function HomeScreen() {
//   const navigation = useNavigation<any>();
//   const { user, ax } = useAuth();
//   const [counts, setCounts] = useState({ internships: 0, projects: 0, mous: 0 });

//   useEffect(() => {
//     const a = ax();
//     Promise.all([a.get(`${API_MOUS}/mine`), a.get(API_INT), a.get(API_PROJ)])
//       .then(([m, i, p]) => setCounts({ mous: (m.data || []).length, internships: (i.data || []).length, projects: (p.data || []).length }))
//       .catch(() => {});
//   }, []);

//   return (
//     <View style={styles.screenContainer}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
//       <View style={styles.header}>
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           {/* Avatar — auto updates when profile image changes */}
//           <TouchableOpacity onPress={() => navigation.openDrawer()}>
//             <View style={styles.headerAvatarWrap}>
//               {user?.logo
//                 ? <Image source={{ uri: user.logo }} style={styles.headerAvatarImg} />
//                 : <Text style={styles.headerAvatarTxt}>{(user?.name || "C").charAt(0)}</Text>}
//             </View>
//           </TouchableOpacity>
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.greetingText}>Welcome back,</Text>
//             <Text style={styles.headerTitle}>{user?.name || "Partner"}</Text>
//           </View>
//         </View>
//         <TouchableOpacity onPress={() => navigation.navigate("AIChatbot")} style={styles.aiFab}>
//           <Ionicons name="sparkles" size={20} color={COLORS.white} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         {/* Stats — same as your original */}
//         <View style={styles.statsContainer}>
//           <View style={styles.statCard}><Text style={styles.statNumber}>{counts.internships}</Text><Text style={styles.statLabel}>Internships</Text></View>
//           <View style={styles.statCard}><Text style={styles.statNumber}>{counts.projects}</Text><Text style={styles.statLabel}>Projects</Text></View>
//           <View style={styles.statCard}><Text style={styles.statNumber}>{counts.mous}</Text><Text style={styles.statLabel}>MoUs</Text></View>
//         </View>

//         <Text style={styles.sectionHeader}>Quick Actions</Text>
//         <View style={styles.actionGrid}>
//           <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("InternshipsMain")}>
//             <View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]}>
//               <Ionicons name="briefcase" size={28} color={COLORS.primary} />
//             </View>
//             <Text style={styles.actionTitle}>Internships</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("ManageProjects")}>
//             <View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]}>
//               <Ionicons name="flask" size={28} color={COLORS.primary} />
//             </View>
//             <Text style={styles.actionTitle}>Projects</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("MoUs")}>
//             <View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]}>
//               <Ionicons name="document-text" size={28} color={COLORS.primary} />
//             </View>
//             <Text style={styles.actionTitle}>MoUs</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  PROFILE SCREEN (آپ کا original + backend + image sync)
// // ═══════════════════════════════════════════════════════════════
// function ProfileScreen() {
//   const navigation = useNavigation<any>();
//   const { user, updateUser } = useAuth();
//   const toast = useToast();
//   const [loading,  setLoading]  = useState(false);
//   const [formData, setFormData] = useState({
//     name:     user?.name     || "",
//     email:    user?.email    || "",
//     industry: user?.industry || "",
//     phone:    user?.phone    || "",
//     website:  user?.website  || "",
//     address:  user?.address  || "",
//     about:    user?.about    || "",
//     logo:     user?.logo     || "",
//   });

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") { Alert.alert("Permission needed", "Camera roll access required."); return; }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true, aspect: [1, 1], quality: 0.8,
//     });
//     if (!result.canceled) setFormData({ ...formData, logo: result.assets[0].uri });
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       // updateUser → context update → drawer + home avatar auto-sync
//       await updateUser(formData);
//       toast("Profile updated successfully!", "success");
//     } catch (e: any) {
//       toast(e?.response?.data?.message || "Update failed", "error");
//     } finally { setLoading(false); }
//   };

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Company Profile" back={true} />
//       <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

//         {/* Profile Header — same as your original */}
//         <View style={styles.profileHeaderCard}>
//           <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
//             <Image
//               source={{ uri: formData.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=193648&color=fff&size=256` }}
//               style={styles.profileBigImage} />
//             <View style={styles.cameraBtn}>
//               <Ionicons name="camera" size={16} color="#fff" />
//             </View>
//           </TouchableOpacity>
//           <Text style={styles.profileName}>{formData.name}</Text>
//           <View style={styles.activeTag}>
//             <Text style={styles.activeTagText}>Verified Partner</Text>
//           </View>
//         </View>

//         {/* Form Sections */}
//         <View style={styles.formContainer}>
//           <Text style={styles.sectionHeader}>Company Information</Text>

//           <Text style={styles.formLabel}>Company Name</Text>
//           <TextInput style={styles.input} value={formData.name}
//             onChangeText={t => setFormData({ ...formData, name: t })} />

//           <Text style={styles.formLabel}>Industry Sector</Text>
//           <TextInput style={styles.input} value={formData.industry}
//             onChangeText={t => setFormData({ ...formData, industry: t })} />

//           <Text style={styles.formLabel}>Website</Text>
//           <TextInput style={styles.input} value={formData.website}
//             onChangeText={t => setFormData({ ...formData, website: t })} keyboardType="url" />

//           <Text style={styles.formLabel}>About Us</Text>
//           <TextInput style={[styles.input, styles.textArea]} value={formData.about}
//             onChangeText={t => setFormData({ ...formData, about: t })} multiline numberOfLines={4} />

//           <Text style={styles.sectionHeader}>Contact Details</Text>

//           <Text style={styles.formLabel}>Email Address</Text>
//           <TextInput style={styles.input} value={formData.email}
//             onChangeText={t => setFormData({ ...formData, email: t })} keyboardType="email-address" autoCapitalize="none" />

//           <Text style={styles.formLabel}>Phone Number</Text>
//           <TextInput style={styles.input} value={formData.phone}
//             onChangeText={t => setFormData({ ...formData, phone: t })} keyboardType="phone-pad" />

//           <Text style={styles.formLabel}>Address</Text>
//           <TextInput style={styles.input} value={formData.address}
//             onChangeText={t => setFormData({ ...formData, address: t })} />

//           <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={loading}>
//             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Save Changes</Text>}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MESSAGES SCREEN (آپ کا original)
// // ═══════════════════════════════════════════════════════════════
// function MessagesScreen() {
//   const navigation = useNavigation<any>();
//   const chats = [
//     { id: 1, name: "Internship Incharge",     subtitle: "Riphah International University", time: "10:30 AM", msg: "We have approved the research grant proposal.", avatar: "https://ui-avatars.com/api/?name=II&background=193648&color=fff", unread: 2 },
//     { id: 2, name: "Industry Liaison Incharge", subtitle: "Riphah International University", time: "Yesterday",  msg: "When can we schedule the recruitment drive?",  avatar: "https://ui-avatars.com/api/?name=IL&background=2C5364&color=fff", unread: 0 },
//   ];
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Messages" back={true} />
//       <FlatList data={chats} keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.chatListItem}
//             onPress={() => navigation.navigate("ChatScreen", { contact: item })}>
//             <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
//             <View style={styles.chatContent}>
//               <View style={styles.chatRow}>
//                 <Text style={styles.chatName}>{item.name}</Text>
//                 <Text style={styles.chatTime}>{item.time}</Text>
//               </View>
//               <Text style={styles.chatSubtitle}>{item.subtitle}</Text>
//               <View style={styles.chatRow}>
//                 <Text style={[styles.chatMsg, item.unread > 0 && { fontWeight: "bold", color: COLORS.text }]} numberOfLines={1}>{item.msg}</Text>
//                 {item.unread > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{item.unread}</Text></View>}
//               </View>
//             </View>
//           </TouchableOpacity>
//         )} />
//     </View>
//   );
// }

// function ChatScreen({ route }: any) {
//   const navigation = useNavigation<any>();
//   const { contact } = route.params || { contact: { name: "Industry Liaison Incharge", avatar: "https://ui-avatars.com/api/?name=IL" } };
//   const [messages, setMessages] = useState([{ id: 1, text: "Hello! How can we help you?", sender: "them", time: "10:00 AM" }]);
//   const [input, setInput] = useState("");
//   const flatListRef = useRef<FlatList>(null);

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     const newMsg = { id: Date.now(), text: input, sender: "me", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
//     setMessages(prev => [...prev, newMsg]);
//     setInput("");
//     setTimeout(() => {
//       setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sure, let me check.", sender: "them", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
//     }, 1500);
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screenContainer}>
//       <View style={styles.chatHeader}>
//         <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.primary} /></TouchableOpacity>
//         <Image source={{ uri: contact.avatar }} style={styles.chatHeaderAvatar} />
//         <View><Text style={styles.chatHeaderName}>{contact.name}</Text><Text style={styles.chatHeaderStatus}>Online</Text></View>
//       </View>
//       <FlatList ref={flatListRef} data={messages} keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//         onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
//         renderItem={({ item }) => (
//           <View style={[styles.msgBubble, item.sender === "me" ? styles.msgMe : styles.msgThem]}>
//             <Text style={item.sender === "me" ? styles.msgTextMe : styles.msgTextThem}>{item.text}</Text>
//             <Text style={styles.msgTime}>{item.time}</Text>
//           </View>
//         )} />
//       <View style={styles.inputArea}>
//         <TextInput style={styles.chatInput} placeholder="Type a message..." value={input} onChangeText={setInput} />
//         <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}><Ionicons name="send" size={20} color={COLORS.white} /></TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  AI CHATBOT
// // ═══════════════════════════════════════════════════════════════
// function AIChatbotScreen() {
//   const navigation = useNavigation<any>();
//   const [messages, setMessages] = useState([{ id: 1, text: "Hello! I am your Industry CXbot. How can I help?", sender: "bot" }]);
//   const [typing, setTyping] = useState(false);
//   const [input, setInput] = useState("");
//   const flatListRef = useRef<FlatList>(null);

//   const handleSend = (text: string) => {
//     if (!text.trim()) return;
//     setMessages(prev => [...prev, { id: Date.now(), text, sender: "user" }]);
//     setInput(""); setTyping(true);
//     setTimeout(() => {
//       let botReply = "I can help with that. Please provide more details.";
//       const t = text.toLowerCase();
//       if (t.includes("mou"))         botReply = "Manage all your MoUs in the MoUs section. You can respond, propose changes, or confirm meetings.";
//       if (t.includes("internship"))  botReply = "Post and manage internships in the Internships section.";
//       if (t.includes("meeting"))     botReply = "Meeting management is in MOU detail under the Meeting tab.";
//       setMessages(prev => [...prev, { id: Date.now() + 1, text: botReply, sender: "bot" }]);
//       setTyping(false);
//     }, 2000);
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screenContainer}>
//       <Header title="CXbot" back={true} />
//       <FlatList ref={flatListRef} data={messages} keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//         onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
//         renderItem={({ item }) => (
//           <View style={[styles.aiBubble, item.sender === "user" ? styles.aiUser : styles.aiBot]}>
//             {item.sender === "bot" && <View style={styles.aiIcon}><Ionicons name="sparkles" size={14} color={COLORS.white} /></View>}
//             <Text style={item.sender === "user" ? styles.aiUserText : styles.aiBotText}>{item.text}</Text>
//           </View>
//         )}
//         ListFooterComponent={typing ? <Text style={{ marginLeft: 20, color: COLORS.textLight }}>AI is typing...</Text> : null}
//       />
//       <View style={styles.inputArea}>
//         <TextInput style={styles.chatInput} placeholder="Ask CXbot anything..." value={input} onChangeText={setInput} />
//         <TouchableOpacity style={[styles.sendBtn, { backgroundColor: COLORS.secondary }]} onPress={() => handleSend(input)}>
//           <Ionicons name="arrow-up" size={24} color={COLORS.white} />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  INTERNSHIPS (آپ کے original screens)
// // ═══════════════════════════════════════════════════════════════
// function InternshipsMainScreen() {
//   const navigation = useNavigation<any>();
//   const { ax } = useAuth();
//   const [internships, setInternships] = useState<any[]>([]);
//   const [ld, setLd] = useState(true);

//   useEffect(() => {
//     ax().get(API_INT).then(r => setInternships(r.data || [])).catch(() => {}).finally(() => setLd(false));
//   }, []);

//   if (ld) return <View style={[styles.screenContainer, { justifyContent: "center", alignItems: "center" }]}><ActivityIndicator color={COLORS.primary} size="large" /></View>;

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Internships" back={true} />
//       <ScrollView contentContainerStyle={{ padding: 16 }}>
//         <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("PostNewInternship")}>
//           <Ionicons name="add-circle" size={24} color={COLORS.white} />
//           <Text style={styles.createButtonText}>Post New Internship</Text>
//         </TouchableOpacity>
//         <Text style={styles.sectionHeader}>Active Listings</Text>
//         {internships.length === 0 && <Text style={{ color: COLORS.textLight, textAlign: "center", marginTop: 20 }}>No internships yet. Post your first one!</Text>}
//         {internships.map((item: any) => (
//           <View key={item._id || item.id} style={styles.jobCard}>
//             <Image source={{ uri: item.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" }} style={styles.jobCardImage} />
//             <View style={styles.jobCardContent}>
//               <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                 <Text style={styles.jobCardTitle}>{item.title}</Text>
//                 <View style={styles.activeTag}><Text style={styles.activeTagText}>Active</Text></View>
//               </View>
//               <Text style={styles.jobCardCompany}>{item.company}</Text>
//               <View style={styles.jobFooter}>
//                 <Text style={styles.jobDate}>Posted: {fmtDate(item.date || item.createdAt)}</Text>
//                 <Text style={styles.jobApps}>{item.applications || 0} Applicants</Text>
//               </View>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// function PostNewInternshipScreen() {
//   const navigation = useNavigation<any>();
//   const { user, ax } = useAuth();
//   const toast = useToast();
//   const [title,  setTitle]  = useState("");
//   const [skills, setSkills] = useState("");
//   const [desc,   setDesc]   = useState("");
//   const [image,  setImage]  = useState<string | null>(null);
//   const [ld,     setLd]     = useState(false);

//   const pickImage = async () => {
//     const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [16, 9], quality: 1 });
//     if (!r.canceled) setImage(r.assets[0].uri);
//   };

//   const submit = async () => {
//     if (!title) { toast("Title required", "error"); return; }
//     setLd(true);
//     try {
//       await ax().post(API_INT, { title, company: user?.name || "", skills, description: desc,
//         image: image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" });
//       toast("Internship posted!", "success");
//       navigation.goBack();
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setLd(false); }
//   };

//   return (
//     <ScrollView style={styles.screenContainer}>
//       <Header title="New Internship" back={true} />
//       <View style={styles.formContainer}>
//         <TouchableOpacity style={styles.bannerUpload} onPress={pickImage}>
//           {image ? <Image source={{ uri: image }} style={styles.uploadedBanner} />
//             : <View style={styles.uploadPlaceholder}><Ionicons name="image-outline" size={40} color={COLORS.textLight} /><Text style={styles.uploadText}>Upload Cover Image</Text></View>}
//         </TouchableOpacity>
//         <Text style={styles.formLabel}>Job Title</Text>
//         <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. React Developer" placeholderTextColor={COLORS.textLight} />
//         <Text style={styles.formLabel}>Skills</Text>
//         <TextInput style={styles.input} value={skills} onChangeText={setSkills} placeholder="e.g. JavaScript, React" placeholderTextColor={COLORS.textLight} />
//         <Text style={styles.formLabel}>Details</Text>
//         <TextInput style={[styles.input, styles.textArea]} value={desc} onChangeText={setDesc}
//           placeholder="Responsibilities..." placeholderTextColor={COLORS.textLight} multiline />
//         <TouchableOpacity style={[styles.primaryButton, ld && { opacity: 0.7 }]} onPress={submit} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Publish</Text>}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MOU LIST SCREEN
// // ═══════════════════════════════════════════════════════════════
// function MoUScreen() {
//   const navigation = useNavigation<any>();
//   const { ax } = useAuth();
//   const [mous, setMous]   = useState<any[]>([]);
//   const [ld,   setLd]     = useState(true);
//   const [ref,  setRef]    = useState(false);

//   const load = useCallback(async (show = true) => {
//     if (show) setLd(true);
//     try { const r = await ax().get(`${API_MOUS}/mine`); setMous((r.data || []).map(normMou)); }
//     catch {} finally { setLd(false); setRef(false); }
//   }, [ax]);

//   useEffect(() => { load(); }, []);

//   if (ld) return <View style={[styles.screenContainer, { justifyContent: "center", alignItems: "center" }]}><ActivityIndicator color={COLORS.primary} size="large" /></View>;

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="MoUs" back={true} />
//       <View style={{ padding: 16, paddingBottom: 0 }}>
//         <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("CreateMoU")}>
//           <Ionicons name="add-circle" size={22} color={COLORS.white} />
//           <Text style={styles.createButtonText}>Request New MoU</Text>
//         </TouchableOpacity>
//       </View>
//       <FlatList data={mous} keyExtractor={m => m._id}
//         contentContainerStyle={{ padding: 16 }}
//         refreshControl={<RefreshControl refreshing={ref} onRefresh={() => { setRef(true); load(false); }} tintColor={COLORS.primary} />}
//         ListEmptyComponent={<Text style={{ color: COLORS.textLight, textAlign: "center", marginTop: 20 }}>No MoUs yet. Request your first one!</Text>}
//         renderItem={({ item: m }) => (
//           <TouchableOpacity
//             style={[styles.mouCard, ["m", "Changes Proposed"].includes(m.status) && { borderLeftWidth: 4, borderLeftColor: COLORS.primary }]}
//             onPress={() => navigation.navigate("MouDetail", { mouId: m._id })}
//             activeOpacity={0.85}>
//             <View style={styles.mouHeader}>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.mouUni}>{m.title || m.university}</Text>
//                 <Text style={styles.mouDept}>{m.university}</Text>
//               </View>
//               <SBadge status={m.status} />
//             </View>
//             <Text style={styles.mouType}>{m.collaborationType}</Text>
//             <View style={styles.mouFooter}>
//               <Text style={styles.dateLabel}>{fmtDate(m.startDate)} → {fmtDate(m.endDate)}</Text>
//             </View>
//             {m.meetingConfirmedSlot?.date && (
//               <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8, backgroundColor: "#f0fdf4", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: "flex-start" }}>
//                 <Ionicons name="checkmark-circle" size={11} color="#16a34a" />
//                 <Text style={{ fontSize: 11, color: "#16a34a", fontWeight: "600" }}>Meeting: {m.meetingConfirmedSlot.date}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         )} />
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  CREATE MOU SCREEN
// // ═══════════════════════════════════════════════════════════════
// function CreateMoUScreen() {
//   const navigation = useNavigation<any>();
//   const { user, ax } = useAuth();
//   const toast = useToast();
//   const [dept,     setDept]     = useState("");
//   const [type,     setType]     = useState("");
//   const [desc,     setDesc]     = useState("");
//   const [title,    setTitle]    = useState("");
//   const [duration, setDuration] = useState("1 Year");
//   const [ld,       setLd]       = useState(false);

//   const handleCreate = async () => {
//     if (!dept || !type) { Alert.alert("Missing Details", "Please specify the department and collaboration type."); return; }
//     setLd(true);
//     try {
//       const cl = addCL({ changeLog: [] }, "university_change", { party: "Industry", message: `MOU "${title || dept}" created` });
//       await ax().post(API_MOUS, {
//         title: title || dept, university: "Riphah International University",
//         collaborationType: type, description: desc,
//         industry: user?.name || "", industryId: user?._id,
//         industryLogo: user?.logo || "", status: "Draft", changeLog: cl,
//         startDate: new Date().toISOString().split("T")[0],
//         endDate: new Date(new Date().setFullYear(new Date().getFullYear() + (duration === "1 Year" ? 1 : 2))).toISOString().split("T")[0],
//       });
//       toast("MoU request sent!", "success");
//       navigation.goBack();
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setLd(false); }
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screenContainer}>
//       <Header title="Request MoU" back={true} />
//       <ScrollView contentContainerStyle={styles.formContainer}>
//         <Text style={styles.formLabel}>Title</Text>
//         <TextInput style={styles.input} placeholder="MOU Title" placeholderTextColor={COLORS.textLight} value={title} onChangeText={setTitle} />
//         <Text style={styles.formLabel}>University</Text>
//         <TextInput style={[styles.input, { backgroundColor: "#F3F4F6" }]} value="Riphah International University" editable={false} />
//         <Text style={styles.formLabel}>Department *</Text>
//         <TextInput style={styles.input} placeholder="e.g. Software Engineering Department" placeholderTextColor={COLORS.textLight} value={dept} onChangeText={setDept} />
//         <Text style={styles.formLabel}>Collaboration Type *</Text>
//         <TextInput style={styles.input} placeholder="e.g. Research, Internship Drive" placeholderTextColor={COLORS.textLight} value={type} onChangeText={setType} />
//         <Text style={styles.formLabel}>Proposal / Description</Text>
//         <TextInput style={[styles.input, styles.textArea]} placeholder="Briefly describe objectives..." placeholderTextColor={COLORS.textLight} multiline numberOfLines={5} value={desc} onChangeText={setDesc} />
//         <Text style={styles.formLabel}>Duration</Text>
//         <View style={{ flexDirection: "row", gap: 10 }}>
//           {["1 Year", "2 Years"].map(d => (
//             <TouchableOpacity key={d} onPress={() => setDuration(d)}
//               style={[styles.durationBtn, duration === d && styles.durationBtnActive]}>
//               <Text style={duration === d ? styles.durationTextActive : styles.durationText}>{d}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <TouchableOpacity style={[styles.primaryButton, ld && { opacity: 0.7 }]} onPress={handleCreate} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Submit Request</Text>}
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MOU DETAIL SCREEN (Full MOU Logic)
// // ═══════════════════════════════════════════════════════════════
// function MouDetailScreen({ route }: any) {
//   const nav = useNavigation<any>();
//   const { ax } = useAuth();
//   const toast = useToast();
//   const [mou,    setMou]   = useState<any>(null);
//   const [ld,     setLd]    = useState(true);
//   const [actLd,  setActLd] = useState(false);
//   const [tab,    setTab]   = useState<"info" | "meeting" | "activity">("info");
//   const [rModal, setRM]    = useState(false);
//   const [mModal, setMM]    = useState(false);
//   const mouId = route.params?.mouId;

//   useEffect(() => {
//     ax().get(`${API_MOUS}/${mouId}`).then(r => setMou(normMou(r.data))).catch(() => {}).finally(() => setLd(false));
//   }, [mouId]);

//   const upd = (u: any) => setMou(normMou(u));

//   const doResponse = async (rd: any) => {
//     setActLd(true);
//     try {
//       const lt = rd.type === "accept" ? "industry_approve" : rd.type === "reject" ? "industry_reject" : rd.type === "change" ? "industry_change" : "industry_response";
//       const cl = addCL(mou, lt, { party: "Industry", from: mou.industry, message: rd.message });
//       let ns = mou.status;
//       if (rd.type === "accept") ns = "Approved by Industry";
//       else if (rd.type === "reject") ns = "Rejected";
//       else if (rd.type === "change") ns = "Changes Proposed";
//       else ns = "Industry Responded";
//       const stamp = rd.type === "accept" ? { by: mou.industry, type: "approve", date: new Date().toISOString() } : mou.industryStamp;
//       const pl = { ...bldPayload(mou), status: ns, changeLog: cl, industryStamp: stamp, industryResponseAt: new Date().toISOString(),
//         proposedChanges: rd.changes ? [...(mou.proposedChanges || []), ...rd.changes] : (mou.proposedChanges || []) };
//       const r = await ax().put(`${API_MOUS}/${mou._id}`, pl);
//       upd({ ...r.data, ...pl }); setRM(false);
//       toast(rd.type === "accept" ? "🎉 MOU Approved!" : rd.type === "reject" ? "MOU Rejected" : "Response sent", rd.type === "reject" ? "error" : "success");
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setActLd(false); }
//   };

//   const selSlot = async (opt: any) => {
//     const sl = { date: opt.date || "", time: opt.time || "", note: opt.note || "" };
//     const now = new Date().toISOString(); setActLd(true);
//     try {
//       const cl = addCL(mou, "meeting_confirmed", { party: "Industry", from: mou.industry, message: `Confirmed: ${sl.date} at ${sl.time}` });
//       const pl = { ...bldPayload(mou), scheduledMeeting: { ...mou.scheduledMeeting, industryProposedSlot: null },
//         meetingConfirmedSlot: sl, meetingConfirmedAt: now, changeLog: cl };
//       const r = await ax().put(`${API_MOUS}/${mou._id}`, pl);
//       upd({ ...r.data, meetingConfirmedSlot: sl, meetingConfirmedAt: now });
//       toast(`🤝 Meeting confirmed: ${sl.date}!`, "success");
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setActLd(false); }
//   };

//   const propSlot = async (sd: any) => {
//     const prop = { date: sd.date || "", time: sd.time || "", note: sd.note || "" };
//     const now = new Date().toISOString(); setActLd(true);
//     try {
//       const cl = addCL(mou, "meeting_proposed", { party: "Industry", from: mou.industry, message: `Proposed: ${prop.date} at ${prop.time}` });
//       const pl = { ...bldPayload(mou), scheduledMeeting: { ...mou.scheduledMeeting, industryProposedSlot: null },
//         meetingIndustryProposedSlot: prop, meetingIndustryProposedAt: now, meetingConfirmedSlot: null, meetingConfirmedAt: null, changeLog: cl };
//       const r = await ax().put(`${API_MOUS}/${mou._id}`, pl);
//       upd({ ...r.data, meetingIndustryProposedSlot: prop, meetingIndustryProposedAt: now, meetingConfirmedSlot: null, meetingConfirmedAt: null });
//       setMM(false); toast("Slot proposed to University", "info");
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setActLd(false); }
//   };

//   if (ld) return <View style={[styles.screenContainer, { justifyContent: "center", alignItems: "center" }]}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
//   if (!mou) return <View style={styles.screenContainer}><Header title="MOU" back /></View>;

//   const mtg = mou.scheduledMeeting;
//   const cs = mou.meetingConfirmedSlot, hasC = !!(cs?.date);
//   const ip = mou.meetingIndustryProposedSlot, hasI = !!(ip?.date);
//   const hasOpts = mtg?.options?.length > 0, hasSingle = mtg?.date && mtg?.time;
//   const canResp = ["Sent to Industry", "Changes Proposed"].includes(mou.status);

//   return (
//     <View style={styles.screenContainer}>
//       <Header title={mou.title || "MOU Detail"} back />
//       <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: COLORS.border }}>
//         <SBadge status={mou.status} />
//         <Text style={{ fontSize: 11, color: COLORS.textLight }}>Created: {fmtDate(mou.createdAt)}</Text>
//       </View>

//       {canResp && (
//         <View style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: COLORS.border }}>
//           <TouchableOpacity style={styles.primaryButton} onPress={() => setRM(true)} disabled={actLd}>
//             {actLd ? <ActivityIndicator color="#fff" size="small" />
//               : <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
//                   <Ionicons name="chatbubble-ellipses" size={15} color="#fff" />
//                   <Text style={styles.primaryButtonText}>Send Response to University</Text>
//                 </View>}
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Tabs */}
//       <View style={{ flexDirection: "row", backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: COLORS.border }}>
//         {(["info", "meeting", "activity"] as const).map(t => (
//           <TouchableOpacity key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]} onPress={() => setTab(t)}>
//             <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>
//               {t === "info" ? "Details" : t === "meeting" ? "Meeting" : "Activity"}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 50 }} showsVerticalScrollIndicator={false}>

//         {/* DETAILS TAB */}
//         {tab === "info" && <>
//           <View style={styles.mouCard}><Text style={styles.formLabel}>Collaboration Type</Text><Text>{mou.collaborationType || "—"}</Text></View>
//           <View style={styles.mouCard}><Text style={styles.formLabel}>Duration</Text><Text>{fmtDate(mou.startDate)} → {fmtDate(mou.endDate)}</Text></View>
//           {mou.description && <View style={styles.mouCard}><Text style={styles.formLabel}>Purpose</Text><Text>{mou.description}</Text></View>}
//           {mou.objectives?.filter(Boolean).length > 0 && (
//             <View style={styles.mouCard}>
//               <Text style={styles.formLabel}>Objectives</Text>
//               {mou.objectives.filter(Boolean).map((o: string, i: number) => <Text key={i} style={{ fontSize: 13, color: COLORS.text, marginBottom: 3 }}>• {o}</Text>)}
//             </View>
//           )}
//           {mou.proposedChanges?.length > 0 && (
//             <View style={[styles.mouCard, { borderLeftWidth: 3, borderLeftColor: "#7c3aed" }]}>
//               <Text style={[styles.formLabel, { color: "#7c3aed" }]}>⚠️ {mou.proposedChanges.length} Proposed Change(s)</Text>
//               {mou.proposedChanges.map((c: any, i: number) => (
//                 <View key={i} style={{ backgroundColor: "#f5f3ff", borderRadius: 8, padding: 10, marginBottom: 6 }}>
//                   <Text style={{ fontSize: 12, fontWeight: "700", color: "#7c3aed" }}>📝 {c.field || `#${i + 1}`}</Text>
//                   <Text style={{ fontSize: 12 }}>
//                     <Text style={{ textDecorationLine: "line-through", color: COLORS.danger }}>{c.oldValue}</Text>
//                     {"  →  "}
//                     <Text style={{ color: "#16a34a" }}>{c.newValue}</Text>
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           )}
//         </>}

//         {/* MEETING TAB */}
//         {tab === "meeting" && <>
//           {!mtg && <View style={{ alignItems: "center", paddingVertical: 40 }}><Ionicons name="calendar-outline" size={44} color={COLORS.textLight} /><Text style={{ color: COLORS.textLight, marginTop: 10, fontSize: 15 }}>No meeting scheduled yet</Text><Text style={{ color: COLORS.textLight, fontSize: 13 }}>University will propose a time.</Text></View>}
//           {mtg && <>
//             {/* State 1: Confirmed */}
//             {hasC && (
//               <View style={styles.confCard}>
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
//                   <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
//                   <Text style={{ fontSize: 15, fontWeight: "800", color: "#166534" }}>🤝 Meeting Confirmed!</Text>
//                 </View>
//                 <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
//                   <View style={styles.ccell}><Text style={styles.ccLbl}>DATE</Text><Text style={styles.ccVal}>{cs!.date}</Text></View>
//                   <View style={styles.ccell}><Text style={styles.ccLbl}>TIME</Text><Text style={styles.ccVal}>🕐 {cs!.time}</Text></View>
//                 </View>
//                 {mtg.venue && <Text style={{ fontSize: 12, color: COLORS.textLight }}>📍 {mtg.venue}</Text>}
//                 <Text style={{ fontSize: 10, color: "#6b7280", marginTop: 6 }}>Confirmed: {fmtDT(mou.meetingConfirmedAt)}</Text>
//               </View>
//             )}
//             {/* State 2: Industry proposed, waiting */}
//             {!hasC && hasI && (
//               <View style={styles.pendCard}>
//                 <Text style={{ fontSize: 14, fontWeight: "700", color: "#92400e", marginBottom: 6 }}>⏳ Awaiting University Confirmation</Text>
//                 <Text style={{ fontSize: 12, color: "#a16207", marginBottom: 10 }}>You proposed:</Text>
//                 <View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
//                   <View style={[styles.ccell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}><Text style={[styles.ccLbl, { color: "#92400e" }]}>DATE</Text><Text style={[styles.ccVal, { color: "#92400e" }]}>{ip!.date}</Text></View>
//                   <View style={[styles.ccell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}><Text style={[styles.ccLbl, { color: "#92400e" }]}>TIME</Text><Text style={[styles.ccVal, { color: "#92400e" }]}>🕐 {ip!.time}</Text></View>
//                 </View>
//                 <TouchableOpacity style={styles.outlineBtn} onPress={() => setMM(true)}>
//                   <Ionicons name="pencil" size={13} color={COLORS.primary} />
//                   <Text style={styles.outlineBtnTxt}>Change Slot</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//             {/* State 3: Multiple options */}
//             {!hasC && !hasI && hasOpts && <>
//               <Text style={{ fontSize: 13, color: "#0284c7", fontWeight: "600", marginBottom: 12 }}>📋 Select a time or propose your own:</Text>
//               {mtg.options.map((opt: any, i: number) => (
//                 <View key={i} style={[styles.mouCard, { flexDirection: "row", alignItems: "center" }]}>
//                   <View style={{ flex: 1 }}>
//                     <Text style={{ fontSize: 13, fontWeight: "600", color: COLORS.primary }}>{opt.date} at {opt.time}</Text>
//                     {opt.note && <Text style={{ fontSize: 11, color: COLORS.textLight }}>{opt.note}</Text>}
//                   </View>
//                   <TouchableOpacity style={styles.selBtn} onPress={() => selSlot(opt)} disabled={actLd}>
//                     <Ionicons name="checkmark" size={13} color="#fff" />
//                     <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Select</Text>
//                   </TouchableOpacity>
//                 </View>
//               ))}
//               <TouchableOpacity style={styles.outlineBtn} onPress={() => setMM(true)}>
//                 <Ionicons name="pencil" size={13} color={COLORS.primary} />
//                 <Text style={styles.outlineBtnTxt}>Propose Different Slot</Text>
//               </TouchableOpacity>
//             </>}
//             {/* State 4: Single slot */}
//             {!hasC && !hasI && !hasOpts && hasSingle && <>
//               <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: "600", marginBottom: 12 }}>📅 University proposed this meeting:</Text>
//               <View style={styles.mouCard}>
//                 <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.primary }}>{fmtDate(mtg.date)} at {mtg.time}</Text>
//                 {mtg.venue && <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>📍 {mtg.venue}</Text>}
//               </View>
//               <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
//                 <TouchableOpacity style={[styles.selBtn, { flex: 1, justifyContent: "center", paddingVertical: 12 }]}
//                   onPress={() => selSlot({ date: mtg.date, time: mtg.time, note: "" })} disabled={actLd}>
//                   <Ionicons name="checkmark-circle" size={14} color="#fff" />
//                   <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Confirm This Slot</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.outlineBtn, { flex: 1, justifyContent: "center" }]} onPress={() => setMM(true)}>
//                   <Ionicons name="pencil" size={13} color={COLORS.primary} />
//                   <Text style={styles.outlineBtnTxt}>Propose New Slot</Text>
//                 </TouchableOpacity>
//               </View>
//             </>}
//           </>}
//         </>}

//         {/* ACTIVITY TAB */}
//         {tab === "activity" && <>
//           {hasC && (
//             <View style={[styles.confCard, { marginBottom: 16 }]}>
//               <Text style={{ fontSize: 13, fontWeight: "700", color: "#166534", marginBottom: 8 }}>✅ Meeting Confirmed</Text>
//               <View style={{ flexDirection: "row", gap: 10 }}>
//                 <View style={styles.ccell}><Text style={styles.ccLbl}>DATE</Text><Text style={styles.ccVal}>{cs!.date}</Text></View>
//                 <View style={styles.ccell}><Text style={styles.ccLbl}>TIME</Text><Text style={styles.ccVal}>🕐 {cs!.time}</Text></View>
//               </View>
//             </View>
//           )}
//           <Text style={styles.sectionHeader}>Timeline</Text>
//           {[
//             { lbl: "Draft Created",      date: mou.createdAt,          done: true },
//             { lbl: "Sent to Industry",   date: mou.sentAt,             done: !!mou.sentAt },
//             { lbl: "Our Response",       date: mou.industryResponseAt, done: !!mou.industryResponseAt },
//             { lbl: "Meeting Confirmed",  date: mou.meetingConfirmedAt, done: hasC },
//             { lbl: "Mutually Approved",  date: null,                   done: mou.status === "Mutually Approved" },
//           ].map((t, i) => (
//             <View key={i} style={{ flexDirection: "row", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
//               <View style={[styles.tlDot, { backgroundColor: t.done ? "#16a34a" : COLORS.border }]}>
//                 {t.done && <Ionicons name="checkmark" size={10} color="#fff" />}
//               </View>
//               <View>
//                 <Text style={{ fontSize: 13, fontWeight: "600", color: t.done ? COLORS.primary : COLORS.textLight }}>{t.lbl}</Text>
//                 {t.date && <Text style={{ fontSize: 11, color: COLORS.textLight }}>{fmtDate(t.date)}</Text>}
//               </View>
//             </View>
//           ))}

//           {(mou.changeLog || []).length > 0 && <>
//             <Text style={[styles.sectionHeader, { marginTop: 16 }]}>All Activity</Text>
//             {[...(mou.changeLog || [])].reverse().map((e: any, i: number) => {
//               const c = CT[e.type] || { c: COLORS.textLight, bg: "#f1f5f9", ic: "📌", lbl: e.type };
//               return (
//                 <View key={e.id || i} style={[styles.logEntry, { backgroundColor: c.bg, borderColor: c.c + "30" }]}>
//                   <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
//                     <Text style={{ fontSize: 14 }}>{c.ic}</Text>
//                     <Text style={{ fontSize: 11, fontWeight: "700", color: c.c }}>{c.lbl}</Text>
//                     <Text style={{ marginLeft: "auto", fontSize: 10, color: COLORS.textLight }}>{e.party}</Text>
//                   </View>
//                   {e.message && <Text style={{ fontSize: 12, color: COLORS.text, lineHeight: 17 }}>{e.message}</Text>}
//                   <Text style={{ fontSize: 10, color: COLORS.textLight, marginTop: 4 }}>{fmtDT(e.date)}</Text>
//                 </View>
//               );
//             })}
//           </>}
//         </>}
//       </ScrollView>

//       <RespModal    visible={rModal} mou={mou} onClose={() => setRM(false)} onSave={doResponse} loading={actLd} />
//       <PropMtgModal visible={mModal} mou={mou} onClose={() => setMM(false)} onSave={propSlot}   loading={actLd} />
//     </View>
//   );
// }

// // ─── Response Modal ───────────────────────────────────────────
// const RespModal = ({ visible, mou, onClose, onSave, loading }: any) => {
//   const [type, setType] = useState<"accept" | "reject" | "comment" | "change">("comment");
//   const [msg,  setMsg]  = useState("");
//   const [changes, setChanges] = useState([{ field: "", oldValue: "", newValue: "", reason: "" }]);
//   const cfg = {
//     accept:  { c: "#16a34a", bg: "#f0fdf4", lbl: "Accept MOU",      ic: "thumbs-up" },
//     reject:  { c: "#dc2626", bg: "#fef2f2", lbl: "Reject MOU",      ic: "thumbs-down" },
//     comment: { c: "#0284c7", bg: "#eff6ff", lbl: "Comment",         ic: "chatbubble" },
//     change:  { c: "#7c3aed", bg: "#f5f3ff", lbl: "Propose Changes", ic: "refresh" },
//   };
//   const go = () => {
//     if (!msg.trim() && type !== "accept" && type !== "reject") { Alert.alert("Required", "Enter a message."); return; }
//     onSave({ type, message: msg || (type === "accept" ? `${mou?.industry} accepted.` : `${mou?.industry} rejected.`),
//       changes: type === "change" ? changes.filter(c => c.field).map(c => ({ ...c, date: new Date().toISOString() })) : undefined });
//   };
//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.sheet}>
//           <View style={styles.shHandle} />
//           <View style={styles.shHead}><Text style={styles.shTitle}>Response — {mou?.industry}</Text><TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={COLORS.text} /></TouchableOpacity></View>
//           <ScrollView contentContainerStyle={{ padding: 16 }}>
//             <Text style={styles.formLabel}>Response Type</Text>
//             <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14, marginTop: 6 }}>
//               {(Object.keys(cfg) as Array<keyof typeof cfg>).map(k => (
//                 <TouchableOpacity key={k} style={[styles.rtBtn, type === k && { borderColor: cfg[k].c, backgroundColor: cfg[k].bg }]} onPress={() => setType(k)}>
//                   <Ionicons name={cfg[k].ic as any} size={14} color={type === k ? cfg[k].c : COLORS.textLight} />
//                   <Text style={[{ fontSize: 12, fontWeight: "600", color: COLORS.textLight }, type === k && { color: cfg[k].c }]}>{cfg[k].lbl}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <Text style={styles.formLabel}>Message</Text>
//             <TextInput style={[styles.input, { height: 90, textAlignVertical: "top" }]} value={msg} onChangeText={setMsg}
//               placeholder={type === "accept" ? "Note (optional)..." : "Your message..."} placeholderTextColor={COLORS.textLight} multiline />
//             {type === "change" && <>
//               <Text style={[styles.formLabel, { color: "#7c3aed" }]}>Proposed Changes</Text>
//               {changes.map((c, i) => (
//                 <View key={i} style={{ backgroundColor: "#f5f3ff", borderRadius: 10, padding: 12, marginBottom: 10, gap: 6 }}>
//                   <TextInput style={styles.input} placeholder="Field / Section" placeholderTextColor={COLORS.textLight} value={c.field} onChangeText={v => { const a = [...changes]; a[i].field = v; setChanges(a); }} />
//                   <View style={{ flexDirection: "row", gap: 8 }}>
//                     <TextInput style={[styles.input, { flex: 1 }]} placeholder="Current" placeholderTextColor={COLORS.textLight} value={c.oldValue} onChangeText={v => { const a = [...changes]; a[i].oldValue = v; setChanges(a); }} />
//                     <TextInput style={[styles.input, { flex: 1 }]} placeholder="New value" placeholderTextColor={COLORS.textLight} value={c.newValue} onChangeText={v => { const a = [...changes]; a[i].newValue = v; setChanges(a); }} />
//                   </View>
//                   <TextInput style={styles.input} placeholder="Reason" placeholderTextColor={COLORS.textLight} value={c.reason} onChangeText={v => { const a = [...changes]; a[i].reason = v; setChanges(a); }} />
//                 </View>
//               ))}
//               <TouchableOpacity onPress={() => setChanges(c => [...c, { field: "", oldValue: "", newValue: "", reason: "" }])}>
//                 <Text style={{ color: "#7c3aed", fontWeight: "700", textAlign: "center", marginBottom: 10 }}>+ Add Change</Text>
//               </TouchableOpacity>
//             </>}
//           </ScrollView>
//           <View style={styles.shFoot}>
//             <TouchableOpacity style={{ paddingHorizontal: 18, justifyContent: "center" }} onPress={onClose}>
//               <Text style={{ color: COLORS.textLight, fontSize: 14, fontWeight: "600" }}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.primaryButton, { flex: 1, backgroundColor: cfg[type].c }]} onPress={go} disabled={loading}>
//               {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.primaryButtonText}>Submit</Text>}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ─── Propose Meeting Modal ─────────────────────────────────────
// const PropMtgModal = ({ visible, mou, onClose, onSave, loading }: any) => {
//   const [date, setDate] = useState(""), [time, setTime] = useState(""), [note, setNote] = useState("");
//   const mtg = mou?.scheduledMeeting;
//   const use = (o: any) => { setDate(o.date || ""); setTime(o.time || ""); setNote(o.note || ""); };
//   const go = () => { if (!date || !time) { Alert.alert("Required", "Enter date and time."); return; } onSave({ date, time, note }); };
//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.sheet}>
//           <View style={styles.shHandle} />
//           <View style={styles.shHead}><Text style={styles.shTitle}>Propose Meeting Slot</Text><TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={COLORS.text} /></TouchableOpacity></View>
//           <ScrollView contentContainerStyle={{ padding: 16 }}>
//             <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#eff6ff", padding: 12, borderRadius: 10, marginBottom: 14 }}>
//               <Ionicons name="information-circle" size={16} color="#0284c7" />
//               <Text style={{ fontSize: 12, color: "#0284c7", flex: 1 }}>University will review and confirm your proposed slot.</Text>
//             </View>
//             {mtg?.options?.length > 0 && <>
//               <Text style={styles.formLabel}>University's options (tap to use):</Text>
//               {mtg.options.map((o: any, i: number) => (
//                 <TouchableOpacity key={i} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f0f9ff", borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: "#bae6fd" }} onPress={() => use(o)}>
//                   <Text style={{ fontSize: 13, color: "#0284c7", fontWeight: "600" }}>{o.date} at {o.time}</Text>
//                   <Text style={{ fontSize: 11, color: "#0284c7", fontWeight: "700" }}>Use</Text>
//                 </TouchableOpacity>
//               ))}
//             </>}
//             {mtg?.date && !mtg?.options?.length && (
//               <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f0f9ff", borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: "#bae6fd" }} onPress={() => use({ date: mtg.date, time: mtg.time })}>
//                 <Text style={{ fontSize: 13, color: "#0284c7", fontWeight: "600" }}>{fmtDate(mtg.date)} at {mtg.time}</Text>
//                 <Text style={{ fontSize: 11, color: "#0284c7", fontWeight: "700" }}>Use</Text>
//               </TouchableOpacity>
//             )}
//             <Text style={styles.formLabel}>Your Preferred Date *</Text>
//             <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={COLORS.textLight} value={date} onChangeText={setDate} />
//             <Text style={styles.formLabel}>Your Preferred Time *</Text>
//             <TextInput style={styles.input} placeholder="HH:MM" placeholderTextColor={COLORS.textLight} value={time} onChangeText={setTime} />
//             <Text style={styles.formLabel}>Note (optional)</Text>
//             <TextInput style={styles.input} placeholder="e.g. Prefer morning" placeholderTextColor={COLORS.textLight} value={note} onChangeText={setNote} />
//           </ScrollView>
//           <View style={styles.shFoot}>
//             <TouchableOpacity style={{ paddingHorizontal: 18, justifyContent: "center" }} onPress={onClose}>
//               <Text style={{ color: COLORS.textLight, fontSize: 14, fontWeight: "600" }}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.primaryButton, { flex: 1 }]} onPress={go} disabled={loading}>
//               {loading ? <ActivityIndicator color="#fff" size="small" />
//                 : <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><Ionicons name="send" size={13} color="#fff" /><Text style={styles.primaryButtonText}>Submit to University</Text></View>}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// //  MANAGE PROJECTS
// // ═══════════════════════════════════════════════════════════════
// function ManageProjects() {
//   const navigation = useNavigation<any>();
//   const { ax } = useAuth();
//   const [projects, setProjects] = useState<any[]>([]);
//   const [ld, setLd] = useState(true);
//   useEffect(() => { ax().get(API_PROJ).then(r => setProjects(r.data || [])).catch(() => {}).finally(() => setLd(false)); }, []);

//   if (ld) return <View style={[styles.screenContainer, { justifyContent: "center", alignItems: "center" }]}><ActivityIndicator color={COLORS.primary} size="large" /></View>;
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Projects" back={true} />
//       <ScrollView contentContainerStyle={{ padding: 16 }}>
//         <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("PostNewProject" as any)}>
//           <Ionicons name="add" size={24} color="#fff" />
//           <Text style={styles.createButtonText}>Add New Project</Text>
//         </TouchableOpacity>
//         {projects.length === 0 && <Text style={{ color: COLORS.textLight, textAlign: "center", marginTop: 20 }}>No projects yet.</Text>}
//         {projects.map((item: any) => (
//           <View key={item._id || item.id} style={styles.jobCard}>
//             <Image source={{ uri: item.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" }} style={styles.jobCardImage} />
//             <View style={styles.jobCardContent}>
//               <Text style={styles.jobCardTitle}>{item.title}</Text>
//               <Text style={styles.jobCardCompany}>{item.type}</Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// function PostNewProjectScreen() {
//   const navigation = useNavigation<any>();
//   const { ax } = useAuth();
//   const toast = useToast();
//   const [title, setTitle] = useState("");
//   const [ld, setLd] = useState(false);
//   const go = async () => {
//     if (!title) { toast("Title required", "error"); return; }
//     setLd(true);
//     try {
//       await ax().post(API_PROJ, { title, type: "Research", image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80" });
//       toast("Project added!", "success"); navigation.goBack();
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setLd(false); }
//   };
//   return (
//     <ScrollView style={styles.screenContainer}>
//       <Header title="New Project" back={true} />
//       <View style={styles.formContainer}>
//         <Text style={styles.formLabel}>Title</Text>
//         <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Project Title" placeholderTextColor={COLORS.textLight} />
//         <TouchableOpacity style={[styles.primaryButton, ld && { opacity: 0.7 }]} onPress={go} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Save Project</Text>}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  CUSTOM DRAWER  (آپ کے original جیسا + CollaXion logo + sync)
// // ═══════════════════════════════════════════════════════════════
// function CustomDrawer(props: any) {
//   const { user, logout } = useAuth();
//   const navigation = useNavigation<any>();

//   return (
//     <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: COLORS.white, flex: 1 }}>
//       <View style={styles.drawerHeader}>
//         {/* CollaXion Logo */}
//         <View style={{ marginBottom: 14 }}>
//           <CXLogo size={22} inv />
//         </View>
//         {/* Avatar — auto-syncs when profile image changes */}
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <View style={styles.drawerAvatarWrap}>
//             {user?.logo
//               ? <Image source={{ uri: user.logo }} style={styles.drawerAvatarImg} />
//               : <Text style={{ fontSize: 24, fontWeight: "900", color: "#fff" }}>{(user?.name || "C").charAt(0)}</Text>}
//           </View>
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.drawerName} numberOfLines={1}>{user?.name || "Partner"}</Text>
//             <Text style={styles.drawerEmail}>{user?.industry || "Industry Partner"}</Text>
//           </View>
//         </View>
//       </View>

//       <View style={{ flex: 1, paddingTop: 10 }}>
//         <DrawerItemList {...props}
//           activeBackgroundColor={COLORS.accent}
//           activeTintColor={COLORS.primary}
//           inactiveTintColor={COLORS.textLight}
//           itemStyle={{ borderRadius: 8, marginHorizontal: 8 }} />
//       </View>

//       <TouchableOpacity style={styles.logoutBtn}
//         onPress={() => Alert.alert("Logout", "Are you sure you want to logout?", [
//           { text: "Cancel", style: "cancel" },
//           { text: "Yes", style: "destructive", onPress: logout },
//         ])}>
//         <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
//         <Text style={styles.logoutText}>Sign Out</Text>
//       </TouchableOpacity>
//     </DrawerContentScrollView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  NAVIGATION (آپ کا original drawer structure + auth stack)
// // ═══════════════════════════════════════════════════════════════
// const Drawer = createDrawerNavigator();
// const Stack  = createNativeStackNavigator();

// const MainApp = () => (
//   <Drawer.Navigator
//     drawerContent={props => <CustomDrawer {...props} />}
//     screenOptions={{
//       headerShown: false,
//       drawerActiveTintColor: COLORS.primary,
//       drawerLabelStyle: { fontSize: 15, marginLeft: -3 },
//       drawerStyle: { width: width * 0.78 },
//     }}>
//     <Drawer.Screen name="Dashboard"        component={HomeScreen}            options={{ drawerIcon: ({ color }) => <Ionicons name="grid-outline"            size={22} color={color} /> }} />
//     <Drawer.Screen name="InternshipsMain"  component={InternshipsMainScreen} options={{ title: "Internships",   drawerIcon: ({ color }) => <Ionicons name="briefcase-outline"       size={22} color={color} /> }} />
//     <Drawer.Screen name="ManageProjects"   component={ManageProjects}        options={{ title: "Projects",      drawerIcon: ({ color }) => <Ionicons name="flask-outline"           size={22} color={color} /> }} />
//     <Drawer.Screen name="MoUs"             component={MoUScreen}             options={{ title: "MoUs",          drawerIcon: ({ color }) => <Ionicons name="document-text-outline"  size={22} color={color} /> }} />
//     <Drawer.Screen name="MessagesMain"     component={MessagesScreen}        options={{ title: "Messages",      drawerIcon: ({ color }) => <Ionicons name="chatbubbles-outline"     size={22} color={color} /> }} />
//     <Drawer.Screen name="Profile"          component={ProfileScreen}         options={{ drawerIcon: ({ color }) => <Ionicons name="person-outline"           size={22} color={color} /> }} />
//     <Drawer.Screen name="AIChatbot"        component={AIChatbotScreen}       options={{ title: "CXbot",         drawerIcon: ({ color }) => <Ionicons name="sparkles-outline"        size={22} color={color} /> }} />
//     {/* Hidden Screens */}
//     <Drawer.Screen name="CreateMoU"        component={CreateMoUScreen}       options={{ drawerItemStyle: { display: "none" } }} />
//     <Drawer.Screen name="PostNewInternship" component={PostNewInternshipScreen} options={{ drawerItemStyle: { display: "none" } }} />
//     <Drawer.Screen name="PostNewProject"   component={PostNewProjectScreen}  options={{ drawerItemStyle: { display: "none" } }} />
//     <Drawer.Screen name="ChatScreen"       component={ChatScreen}            options={{ drawerItemStyle: { display: "none" } }} />
//   </Drawer.Navigator>
// );

// function RootStack() {
//   const { user, ready } = useAuth();
//   if (!ready) return (
//     <View style={[styles.screenContainer, { justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }]}>
//       <CXLogo size={34} inv /><ActivityIndicator color="#fff" style={{ marginTop: 24 }} />
//     </View>
//   );
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {user ? (
//         <>
//           <Stack.Screen name="MainApp"   component={MainApp} />
//           <Stack.Screen name="MouDetail" component={MouDetailScreen} />
//         </>
//       ) : (
//         <>
//           <Stack.Screen name="Login"    component={LoginScreen} />
//           <Stack.Screen name="Register" component={RegisterScreen} />
//         </>
//       )}
//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <ToastProvider>
//         <RootStack />
//       </ToastProvider>
//     </AuthProvider>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  STYLES  (آپ کے original styles + additions)
// // ═══════════════════════════════════════════════════════════════
// const styles = StyleSheet.create({
//   screenContainer: { flex: 1, backgroundColor: COLORS.background },
//   scrollContent:   { padding: 20, paddingBottom: 50 },

//   // Toast
//   toast:    { position: "absolute", top: Platform.OS === "ios" ? 54 : 44, left: 14, right: 14, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, borderWidth: 1, elevation: 10, zIndex: 9999 },
//   toastTxt: { fontSize: 13, fontWeight: "600", flex: 1 },

//   // Header (آپ کا original)
//   header:      { backgroundColor: COLORS.white, paddingTop: Platform.OS === "ios" ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", elevation: 2 },
//   headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.primary },
//   greetingText:{ fontSize: 12, color: COLORS.textLight },
//   headerAvatarWrap:{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: COLORS.border },
//   headerAvatarImg: { width: 40, height: 40, borderRadius: 20 },
//   headerAvatarTxt: { fontSize: 16, fontWeight: "900", color: "#fff" },
//   headerBtn:   { padding: 4 },
//   aiFab:       { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", elevation: 5 },

//   // Badge (آپ کا original + border)
//   statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
//   statusText:  { fontSize: 10, fontWeight: "700" },

//   // Dashboard
//   statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
//   statCard:       { flex: 1, backgroundColor: COLORS.white, padding: 16, borderRadius: 12, marginHorizontal: 5, alignItems: "center", elevation: 2 },
//   statNumber:     { fontSize: 24, fontWeight: "800", color: COLORS.primary },
//   statLabel:      { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
//   sectionHeader:  { fontSize: 18, fontWeight: "700", color: COLORS.primary, marginBottom: 16, marginLeft: 4 },
//   actionGrid:     { flexDirection: "row", flexWrap: "wrap", gap: 12 },
//   actionCard:     { flex: 1, minWidth: "30%", backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: "center", elevation: 2, marginBottom: 10 },
//   actionIcon:     { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginBottom: 12 },
//   actionTitle:    { fontSize: 13, fontWeight: "600", color: COLORS.text, textAlign: "center" },

//   // Forms
//   formContainer: { padding: 20 },
//   formLabel:     { fontSize: 14, fontWeight: "600", color: COLORS.primary, marginBottom: 8, marginTop: 16 },
//   input:         { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, color: COLORS.text },
//   textArea:      { textAlignVertical: "top", height: 100 },
//   primaryButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: "center", marginTop: 32, flexDirection: "row", justifyContent: "center" },
//   primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
//   createButton:  { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary, padding: 14, borderRadius: 12, marginBottom: 16 },
//   createButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8, fontSize: 16 },

//   // Auth
//   authBg:    { flex: 1, backgroundColor: COLORS.primary },
//   authTop:   { paddingTop: Platform.OS === "ios" ? 68 : 54, paddingHorizontal: 28, paddingBottom: 28, alignItems: "center" },
//   authTagline:{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6, letterSpacing: 0.5 },
//   authCard:  { flex: 1, backgroundColor: COLORS.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28 },
//   authTitle: { fontSize: 26, fontWeight: "800", color: COLORS.primary, marginBottom: 6 },
//   authSub:   { fontSize: 14, color: COLORS.textLight, marginBottom: 24 },
//   authLink:  { marginTop: 22, alignItems: "center" },
//   authLinkTxt:{ fontSize: 14, color: COLORS.textLight },
//   passWrap:  { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, backgroundColor: COLORS.white, marginTop: 0 },
//   logoPicker:{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.accent, borderWidth: 2, borderColor: COLORS.border, borderStyle: "dashed", alignSelf: "center", marginBottom: 20, overflow: "hidden", justifyContent: "center", alignItems: "center" },

//   // Image Upload
//   bannerUpload:   { width: "100%", height: 180, backgroundColor: "#E5E7EB", borderRadius: 16, marginBottom: 20, overflow: "hidden", borderWidth: 1, borderColor: "#D1D5DB", borderStyle: "dashed", justifyContent: "center", alignItems: "center" },
//   uploadPlaceholder:{ alignItems: "center" },
//   uploadText:     { marginTop: 8, color: COLORS.textLight, fontWeight: "500" },
//   uploadedBanner: { width: "100%", height: "100%" },

//   // Duration
//   durationBtn:       { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
//   durationBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   durationText:      { fontSize: 12, color: COLORS.text },
//   durationTextActive:{ color: COLORS.white, fontWeight: "600" },

//   // Job Cards
//   jobCard:       { backgroundColor: COLORS.white, borderRadius: 16, marginBottom: 16, overflow: "hidden", elevation: 2 },
//   jobCardImage:  { width: "100%", height: 120 },
//   jobCardContent:{ padding: 16 },
//   jobCardTitle:  { fontSize: 16, fontWeight: "bold", color: COLORS.text },
//   jobCardCompany:{ fontSize: 13, color: COLORS.textLight, marginBottom: 8 },
//   activeTag:     { backgroundColor: "#DEF7EC", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
//   activeTagText: { color: COLORS.success, fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
//   jobFooter:     { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderColor: "#F3F4F6", paddingTop: 12, marginTop: 12 },
//   jobDate:       { fontSize: 12, color: "#9CA3AF" },
//   jobApps:       { fontSize: 12, fontWeight: "600", color: COLORS.primary },

//   // MoU Cards
//   mouCard:   { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 },
//   mouHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
//   mouUni:    { fontSize: 16, fontWeight: "bold", color: COLORS.primary, flex: 1 },
//   mouDept:   { fontSize: 13, color: COLORS.secondary, fontWeight: "600", marginTop: 2 },
//   mouType:   { fontSize: 14, color: COLORS.textLight },
//   mouFooter: { marginTop: 10, borderTopWidth: 1, borderColor: "#eee", paddingTop: 10 },
//   dateLabel: { fontSize: 12, color: "#666" },

//   // Profile
//   profileHeaderCard: { backgroundColor: COLORS.white, padding: 20, alignItems: "center", borderBottomWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
//   imageWrapper:      { position: "relative", marginBottom: 15 },
//   profileBigImage:   { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: COLORS.accent },
//   cameraBtn:         { position: "absolute", bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff" },
//   profileName:       { fontSize: 22, fontWeight: "bold", color: COLORS.primary },

//   // Messages
//   chatListItem: { flexDirection: "row", padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: "#f0f0f0" },
//   chatAvatar:   { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
//   chatContent:  { flex: 1, justifyContent: "center" },
//   chatRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   chatName:     { fontSize: 16, fontWeight: "bold", color: COLORS.primary },
//   chatTime:     { fontSize: 12, color: COLORS.textLight },
//   chatSubtitle: { fontSize: 12, color: COLORS.secondary, marginBottom: 2 },
//   chatMsg:      { fontSize: 14, color: COLORS.textLight, flex: 1 },
//   unreadBadge:  { backgroundColor: COLORS.primary, width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center", marginLeft: 8 },
//   unreadText:   { color: "white", fontSize: 10, fontWeight: "bold" },
//   chatHeader:   { flexDirection: "row", alignItems: "center", padding: 16, paddingTop: Platform.OS === "ios" ? 52 : 40, backgroundColor: COLORS.white, elevation: 2 },
//   chatHeaderAvatar:{ width: 40, height: 40, borderRadius: 20, marginHorizontal: 12 },
//   chatHeaderName:  { fontSize: 16, fontWeight: "bold", color: COLORS.primary },
//   chatHeaderStatus:{ fontSize: 12, color: COLORS.success },
//   msgBubble:    { padding: 12, borderRadius: 16, maxWidth: "80%", marginBottom: 10 },
//   msgMe:        { alignSelf: "flex-end", backgroundColor: COLORS.primary, borderBottomRightRadius: 2 },
//   msgThem:      { alignSelf: "flex-start", backgroundColor: "#e5e5e5", borderBottomLeftRadius: 2 },
//   msgTextMe:    { color: "white" },
//   msgTextThem:  { color: COLORS.text },
//   msgTime:      { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
//   inputArea:    { flexDirection: "row", padding: 10, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: "#eee", alignItems: "center" },
//   chatInput:    { flex: 1, backgroundColor: "#f0f0f0", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
//   sendBtn:      { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" },

//   // AI
//   aiBubble:  { padding: 14, borderRadius: 16, maxWidth: "85%", marginBottom: 12 },
//   aiBot:     { alignSelf: "flex-start", backgroundColor: COLORS.botBubble, borderTopLeftRadius: 2 },
//   aiUser:    { alignSelf: "flex-end", backgroundColor: COLORS.userBubble, borderTopRightRadius: 2 },
//   aiIcon:    { marginBottom: 6, backgroundColor: COLORS.primary, width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center" },
//   aiBotText: { color: COLORS.text },
//   aiUserText:{ color: COLORS.white },

//   // Drawer
//   drawerHeader:   { padding: 20, paddingTop: Platform.OS === "ios" ? 60 : 48, paddingBottom: 20, backgroundColor: COLORS.primary, borderBottomWidth: 1, borderBottomColor: COLORS.border },
//   drawerAvatarWrap:{ width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.secondary, justifyContent: "center", alignItems: "center", overflow: "hidden", borderWidth: 2, borderColor: "rgba(255,255,255,0.25)" },
//   drawerAvatarImg: { width: 64, height: 64, borderRadius: 32 },
//   drawerName:     { fontSize: 16, fontWeight: "800", color: "#fff" },
//   drawerEmail:    { fontSize: 12, color: "rgba(255,255,255,0.6)" },
//   logoutBtn:      { flexDirection: "row", alignItems: "center", padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border },
//   logoutText:     { color: COLORS.danger, fontWeight: "600", marginLeft: 12 },

//   // MOU Detail tabs
//   tabBtn:      { flex: 1, paddingVertical: 13, alignItems: "center" },
//   tabBtnActive:{ borderBottomWidth: 2.5, borderBottomColor: COLORS.primary },
//   tabTxt:      { fontSize: 13, color: COLORS.textLight, fontWeight: "600" },
//   tabTxtActive:{ color: COLORS.primary, fontWeight: "700" },

//   // Meeting
//   confCard: { backgroundColor: "#f0fdf4", borderWidth: 1.5, borderColor: "#86efac", borderRadius: 14, padding: 16, marginBottom: 14 },
//   ccell:    { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#bbf7d0" },
//   ccLbl:    { fontSize: 9, color: "#6b7280", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
//   ccVal:    { fontSize: 14, fontWeight: "800", color: "#15803d" },
//   pendCard: { backgroundColor: "#fffbeb", borderWidth: 1.5, borderColor: "#fde68a", borderRadius: 14, padding: 16, marginBottom: 14 },
//   selBtn:   { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#16a34a", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
//   outlineBtn:   { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, alignSelf: "flex-start", marginTop: 10 },
//   outlineBtnTxt:{ color: COLORS.primary, fontSize: 12, fontWeight: "700" },
//   tlDot:    { width: 22, height: 22, borderRadius: 11, justifyContent: "center", alignItems: "center", flexShrink: 0 },
//   logEntry: { borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1 },

//   // Modal
//   overlay:  { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
//   sheet:    { backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "93%", paddingBottom: Platform.OS === "ios" ? 34 : 16 },
//   shHandle: { width: 36, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 4 },
//   shHead:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderColor: COLORS.border },
//   shTitle:  { fontSize: 16, fontWeight: "700", color: COLORS.primary, flex: 1 },
//   shFoot:   { flexDirection: "row", gap: 10, padding: 16, borderTopWidth: 1, borderColor: COLORS.border },
//   rtBtn:    { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, flex: 1, minWidth: "42%" },
// });




// import { Ionicons } from "@expo/vector-icons";
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList,
// } from "@react-navigation/drawer";
// import { useNavigation } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import * as ImagePicker from "expo-image-picker";
// import React, {
//   createContext, useCallback, useContext,
//   useEffect, useRef, useState
// } from "react";
// import {
//   ActivityIndicator, Alert, Animated, Dimensions,
//   FlatList, Image, KeyboardAvoidingView,
//   Modal, Platform, RefreshControl, ScrollView,
//   StatusBar, StyleSheet, Text, TextInput,
//   TouchableOpacity, View
// } from "react-native";
// import axios from "axios";

// const { width } = Dimensions.get("window");

// // ─── THEME COLORS ──────────────────────────────────────────────
// const COLORS = {
//   primary:    "#193648",
//   secondary:  "#2C5364",
//   accent:     "#e8f0f5",
//   background: "#F8F9FA",
//   white:      "#FFFFFF",
//   text:       "#1F2937",
//   textLight:  "#6B7280",
//   success:    "#10B981",
//   border:     "#E5E7EB",
//   danger:     "#EF4444",
//   botBubble:  "#E0F2FE",
//   userBubble: "#193648",
//   gold:       "#C9A84C",
// };

// // ─── BACKEND CONFIG ────────────────────────────────────────────
// const BASE_URL  = "http://localhost:5000";
// const API_MOUS  = `${BASE_URL}/api/industry/mous`;
// const API_INT   = `${BASE_URL}/api/industry/internships`;
// const API_PROJ  = `${BASE_URL}/api/industry/projects`;
// const API_PROF  = `${BASE_URL}/api/industry/auth`;

// // ─── HELPERS ───────────────────────────────────────────────────
// const fmtDate = (d?: string | null) => {
//   if (!d) return "—";
//   try { return new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }); }
//   catch { return d; }
// };
// const fmtDT = (d?: string | null) => {
//   if (!d) return "—";
//   try { return new Date(d).toLocaleString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
//   catch { return d; }
// };

// // MOU status config
// const SC: Record<string, { c: string; bg: string; lbl: string }> = {
//   Draft:                    { c: "#64748b", bg: "#f1f5f9", lbl: "Draft" },
//   "Sent to Industry":       { c: "#d97706", bg: "#fffbeb", lbl: "Sent to Us" },
//   "Changes Proposed":       { c: "#7c3aed", bg: "#f5f3ff", lbl: "Changes Proposed" },
//   "Industry Responded":     { c: "#0891b2", bg: "#ecfeff", lbl: "Responded" },
//   "Approved by Industry":   { c: "#059669", bg: "#ecfdf5", lbl: "We Approved ✓" },
//   "Approved by University": { c: "#0284c7", bg: "#e0f2fe", lbl: "Uni Approved" },
//   "Mutually Approved":      { c: "#16a34a", bg: "#dcfce7", lbl: "Mutually Approved ✓" },
//   Rejected:                 { c: "#dc2626", bg: "#fef2f2", lbl: "Rejected" },
// };
// const CT: Record<string, { c: string; bg: string; ic: string; lbl: string }> = {
//   industry_change:    { c: "#7c3aed", bg: "#f5f3ff", ic: "🏭", lbl: "Industry Changed" },
//   industry_approve:   { c: "#059669", bg: "#ecfdf5", ic: "✅", lbl: "Industry Approved" },
//   industry_reject:    { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Industry Rejected" },
//   industry_response:  { c: "#0891b2", bg: "#ecfeff", ic: "💬", lbl: "Industry Response" },
//   university_change:  { c: "#0284c7", bg: "#e0f2fe", ic: "🎓", lbl: "University Changed" },
//   university_approve: { c: "#16a34a", bg: "#dcfce7", ic: "✅", lbl: "Uni Approved" },
//   university_reject:  { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Uni Rejected" },
//   meeting_proposed:   { c: "#7c3aed", bg: "#f5f3ff", ic: "📅", lbl: "Meeting Proposed" },
//   meeting_confirmed:  { c: "#16a34a", bg: "#dcfce7", ic: "🤝", lbl: "Meeting Confirmed" },
// };

// const normMou = (m: any) => {
//   if (!m) return m;
//   const cs = m.meetingConfirmedSlot, ip = m.meetingIndustryProposedSlot;
//   return {
//     ...m,
//     meetingConfirmedSlot:        cs?.date ? { date: cs.date, time: cs.time || "", note: cs.note || "" } : null,
//     meetingConfirmedAt:          cs?.date ? m.meetingConfirmedAt : null,
//     meetingIndustryProposedSlot: ip?.date ? { date: ip.date, time: ip.time || "", note: ip.note || "" } : null,
//     meetingIndustryProposedAt:   ip?.date ? m.meetingIndustryProposedAt : null,
//   };
// };
// const bldPayload = (m: any) => ({
//   title: m.title, university: m.university, industry: m.industry, industryId: m.industryId,
//   collaborationType: m.collaborationType, startDate: m.startDate, endDate: m.endDate,
//   description: m.description, objectives: m.objectives || [], responsibilities: m.responsibilities,
//   terms: m.terms || [], signatories: m.signatories, universityContact: m.universityContact,
//   industryContact: m.industryContact, universityLogo: m.universityLogo || "", industryLogo: m.industryLogo || "",
//   status: m.status, universityStamp: m.universityStamp, industryStamp: m.industryStamp,
//   sentAt: m.sentAt, industryResponseAt: m.industryResponseAt,
//   proposedChanges: m.proposedChanges || [], changeLog: m.changeLog || [],
//   scheduledMeeting: m.scheduledMeeting || null,
//   meetingConfirmedSlot: m.meetingConfirmedSlot || null, meetingConfirmedAt: m.meetingConfirmedAt || null,
//   meetingIndustryProposedSlot: m.meetingIndustryProposedSlot || null,
//   meetingIndustryProposedAt: m.meetingIndustryProposedAt || null,
// });
// const addCL = (m: any, type: string, data: any = {}) =>
//   [...(m.changeLog || []), { id: Date.now(), type, date: new Date().toISOString(), ...data }];

// // ─── CollaXion LOGO ────────────────────────────────────────────
// const CXLogo = ({ size = 28, inv = false }: { size?: number; inv?: boolean }) => (
//   <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
//     <View style={{ width: size, height: size, borderRadius: size * 0.22,
//       backgroundColor: inv ? "#fff" : COLORS.primary, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: size * 0.46, fontWeight: "900", color: inv ? COLORS.primary : "#fff" }}>CX</Text>
//     </View>
//     <Text style={{ fontSize: size * 0.56, fontWeight: "800", color: inv ? "#fff" : COLORS.primary }}>
//       Colla<Text style={{ color: COLORS.gold }}>X</Text>ion
//     </Text>
//   </View>
// );

// // ─── STATUS BADGE ──────────────────────────────────────────────
// const SBadge = ({ status }: { status: string }) => {
//   const c = SC[status] || { c: COLORS.textLight, bg: COLORS.accent, lbl: status };
//   return (
//     <View style={[styles.statusBadge, { backgroundColor: c.bg }]}>
//       <Text style={[styles.statusText, { color: c.c }]}>{c.lbl}</Text>
//     </View>
//   );
// };

// // ─── USER CONTEXT (no auth — just profile data) ────────────────
// const UserCtx = createContext<any>(null);
// const useUser = () => useContext(UserCtx);

// // Default user profile (no login needed)
// const DEFAULT_USER = {
//   _id: "industry_001",
//   name: "Tech Solutions Pvt Ltd",
//   email: "hr@techsolutions.com",
//   industry: "Information Technology",
//   phone: "+92 300 1234567",
//   website: "https://techsolutions.com",
//   address: "Islamabad, Pakistan",
//   about: "Leading technology company providing innovative solutions.",
//   logo: "",
// };

// const UserProvider = ({ children }: any) => {
//   const [user, setUser] = useState<any>(DEFAULT_USER);

//   // Axios instance (no auth header needed — or add token manually if backend requires)
//   const ax = useCallback(() => axios.create({ timeout: 10000 }), []);

//   const updateUser = (data: any) => {
//     setUser((prev: any) => ({ ...prev, ...data }));
//   };

//   return (
//     <UserCtx.Provider value={{ user, updateUser, ax }}>
//       {children}
//     </UserCtx.Provider>
//   );
// };

// // ─── TOAST ─────────────────────────────────────────────────────
// const ToastCtx = createContext<any>(null);
// const useToast = () => useContext(ToastCtx);

// const ToastProvider = ({ children }: any) => {
//   const [t, setT] = useState<any>(null);
//   const a = useRef(new Animated.Value(0)).current;
//   const show = (msg: string, type = "info") => {
//     setT({ msg, type });
//     Animated.sequence([
//       Animated.timing(a, { toValue: 1, duration: 260, useNativeDriver: true }),
//       Animated.delay(2700),
//       Animated.timing(a, { toValue: 0, duration: 260, useNativeDriver: true }),
//     ]).start(() => setT(null));
//   };
//   const bg  = t?.type === "success" ? "#dcfce7" : t?.type === "error" ? "#fef2f2" : "#eff6ff";
//   const clr = t?.type === "success" ? "#166534" : t?.type === "error" ? "#991b1b" : "#1e40af";
//   return (
//     <ToastCtx.Provider value={show}>
//       {children}
//       {t && (
//         <Animated.View style={[styles.toast, { backgroundColor: bg, borderColor: clr + "50",
//           opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }] }]}>
//           <Ionicons name={t.type === "success" ? "checkmark-circle" : "information-circle"} size={16} color={clr} />
//           <Text style={[styles.toastTxt, { color: clr }]}>{t.msg}</Text>
//         </Animated.View>
//       )}
//     </ToastCtx.Provider>
//   );
// };

// // ─── REUSABLE HEADER ───────────────────────────────────────────
// const Header = ({ title, back = false, actionIcon, onAction }: any) => {
//   const navigation = useNavigation<any>();
//   return (
//     <View style={styles.header}>
//       <View style={{ flexDirection: "row", alignItems: "center" }}>
//         <TouchableOpacity
//           onPress={() => back ? navigation.goBack() : navigation.openDrawer()}
//           style={styles.headerBtn}>
//           <Ionicons name={back ? "arrow-back" : "menu"} size={26} color={COLORS.primary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{title}</Text>
//       </View>
//       {actionIcon && (
//         <TouchableOpacity onPress={onAction} style={styles.headerBtn}>
//           <Ionicons name={actionIcon} size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// //  HOME SCREEN
// // ═══════════════════════════════════════════════════════════════
// function HomeScreen() {
//   const navigation = useNavigation<any>();
//   const { user, ax } = useUser();
//   const [counts, setCounts] = useState({ internships: 0, projects: 0, mous: 0 });

//   useEffect(() => {
//     const a = ax();
//     Promise.all([
//       a.get(`${API_MOUS}/mine`).catch(() => ({ data: [] })),
//       a.get(API_INT).catch(() => ({ data: [] })),
//       a.get(API_PROJ).catch(() => ({ data: [] })),
//     ]).then(([m, i, p]) =>
//       setCounts({ mous: (m.data || []).length, internships: (i.data || []).length, projects: (p.data || []).length })
//     );
//   }, []);

//   return (
//     <View style={styles.screenContainer}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
//       <View style={styles.header}>
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <TouchableOpacity onPress={() => navigation.openDrawer()}>
//             <View style={styles.headerAvatarWrap}>
//               {user?.logo
//                 ? <Image source={{ uri: user.logo }} style={styles.headerAvatarImg} />
//                 : <Text style={styles.headerAvatarTxt}>{(user?.name || "C").charAt(0)}</Text>}
//             </View>
//           </TouchableOpacity>
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.greetingText}>Welcome back,</Text>
//             <Text style={styles.headerTitle}>{user?.name || "Partner"}</Text>
//           </View>
//         </View>
//         <TouchableOpacity onPress={() => navigation.navigate("AIChatbot")} style={styles.aiFab}>
//           <Ionicons name="sparkles" size={20} color={COLORS.white} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         <View style={styles.statsContainer}>
//           <View style={styles.statCard}><Text style={styles.statNumber}>{counts.internships}</Text><Text style={styles.statLabel}>Internships</Text></View>
//           <View style={styles.statCard}><Text style={styles.statNumber}>{counts.projects}</Text><Text style={styles.statLabel}>Projects</Text></View>
//           <View style={styles.statCard}><Text style={styles.statNumber}>{counts.mous}</Text><Text style={styles.statLabel}>MoUs</Text></View>
//         </View>

//         <Text style={styles.sectionHeader}>Quick Actions</Text>
//         <View style={styles.actionGrid}>
//           <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("InternshipsMain")}>
//             <View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]}>
//               <Ionicons name="briefcase" size={28} color={COLORS.primary} />
//             </View>
//             <Text style={styles.actionTitle}>Internships</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("ManageProjects")}>
//             <View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]}>
//               <Ionicons name="flask" size={28} color={COLORS.primary} />
//             </View>
//             <Text style={styles.actionTitle}>Projects</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("MoUs")}>
//             <View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]}>
//               <Ionicons name="document-text" size={28} color={COLORS.primary} />
//             </View>
//             <Text style={styles.actionTitle}>MoUs</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  PROFILE SCREEN
// // ═══════════════════════════════════════════════════════════════
// function ProfileScreen() {
//   const { user, updateUser, ax } = useUser();
//   const toast = useToast();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name:     user?.name     || "",
//     email:    user?.email    || "",
//     industry: user?.industry || "",
//     phone:    user?.phone    || "",
//     website:  user?.website  || "",
//     address:  user?.address  || "",
//     about:    user?.about    || "",
//     logo:     user?.logo     || "",
//   });

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") { Alert.alert("Permission needed", "Camera roll access required."); return; }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true, aspect: [1, 1], quality: 0.8,
//     });
//     if (!result.canceled) setFormData({ ...formData, logo: result.assets[0].uri });
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       // Try to save to backend; if no backend, just update local state
//       try {
//         await ax().put(`${API_PROF}/profile`, formData);
//       } catch {
//         // Backend not available — save locally only
//       }
//       updateUser(formData);
//       toast("Profile updated successfully!", "success");
//     } catch (e: any) {
//       toast("Update failed", "error");
//     } finally { setLoading(false); }
//   };

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Company Profile" back={true} />
//       <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
//         <View style={styles.profileHeaderCard}>
//           <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
//             <Image
//               source={{ uri: formData.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=193648&color=fff&size=256` }}
//               style={styles.profileBigImage} />
//             <View style={styles.cameraBtn}>
//               <Ionicons name="camera" size={16} color="#fff" />
//             </View>
//           </TouchableOpacity>
//           <Text style={styles.profileName}>{formData.name}</Text>
//           <View style={styles.activeTag}>
//             <Text style={styles.activeTagText}>Verified Partner</Text>
//           </View>
//         </View>

//         <View style={styles.formContainer}>
//           <Text style={styles.sectionHeader}>Company Information</Text>

//           <Text style={styles.formLabel}>Company Name</Text>
//           <TextInput style={styles.input} value={formData.name}
//             onChangeText={t => setFormData({ ...formData, name: t })} />

//           <Text style={styles.formLabel}>Industry Sector</Text>
//           <TextInput style={styles.input} value={formData.industry}
//             onChangeText={t => setFormData({ ...formData, industry: t })} />

//           <Text style={styles.formLabel}>Website</Text>
//           <TextInput style={styles.input} value={formData.website}
//             onChangeText={t => setFormData({ ...formData, website: t })} keyboardType="url" />

//           <Text style={styles.formLabel}>About Us</Text>
//           <TextInput style={[styles.input, styles.textArea]} value={formData.about}
//             onChangeText={t => setFormData({ ...formData, about: t })} multiline numberOfLines={4} />

//           <Text style={styles.sectionHeader}>Contact Details</Text>

//           <Text style={styles.formLabel}>Email Address</Text>
//           <TextInput style={styles.input} value={formData.email}
//             onChangeText={t => setFormData({ ...formData, email: t })} keyboardType="email-address" autoCapitalize="none" />

//           <Text style={styles.formLabel}>Phone Number</Text>
//           <TextInput style={styles.input} value={formData.phone}
//             onChangeText={t => setFormData({ ...formData, phone: t })} keyboardType="phone-pad" />

//           <Text style={styles.formLabel}>Address</Text>
//           <TextInput style={styles.input} value={formData.address}
//             onChangeText={t => setFormData({ ...formData, address: t })} />

//           <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={loading}>
//             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Save Changes</Text>}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MESSAGES SCREEN
// // ═══════════════════════════════════════════════════════════════
// function MessagesScreen() {
//   const navigation = useNavigation<any>();
//   const chats = [
//     { id: 1, name: "Internship Incharge",       subtitle: "Riphah International University", time: "10:30 AM", msg: "We have approved the research grant proposal.",    avatar: "https://ui-avatars.com/api/?name=II&background=193648&color=fff", unread: 2 },
//     { id: 2, name: "Industry Liaison Incharge", subtitle: "Riphah International University", time: "Yesterday", msg: "When can we schedule the recruitment drive?",       avatar: "https://ui-avatars.com/api/?name=IL&background=2C5364&color=fff", unread: 0 },
//   ];
//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Messages" back={true} />
//       <FlatList data={chats} keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.chatListItem}
//             onPress={() => navigation.navigate("ChatScreen", { contact: item })}>
//             <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
//             <View style={styles.chatContent}>
//               <View style={styles.chatRow}>
//                 <Text style={styles.chatName}>{item.name}</Text>
//                 <Text style={styles.chatTime}>{item.time}</Text>
//               </View>
//               <Text style={styles.chatSubtitle}>{item.subtitle}</Text>
//               <View style={styles.chatRow}>
//                 <Text style={[styles.chatMsg, item.unread > 0 && { fontWeight: "bold", color: COLORS.text }]} numberOfLines={1}>{item.msg}</Text>
//                 {item.unread > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{item.unread}</Text></View>}
//               </View>
//             </View>
//           </TouchableOpacity>
//         )} />
//     </View>
//   );
// }

// function ChatScreen({ route }: any) {
//   const navigation = useNavigation<any>();
//   const { contact } = route.params || { contact: { name: "Industry Liaison Incharge", avatar: "https://ui-avatars.com/api/?name=IL" } };
//   const [messages, setMessages] = useState([{ id: 1, text: "Hello! How can we help you?", sender: "them", time: "10:00 AM" }]);
//   const [input, setInput] = useState("");
//   const flatListRef = useRef<FlatList>(null);

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     const newMsg = { id: Date.now(), text: input, sender: "me", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
//     setMessages(prev => [...prev, newMsg]);
//     setInput("");
//     setTimeout(() => {
//       setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sure, let me check.", sender: "them", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
//     }, 1500);
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screenContainer}>
//       <View style={styles.chatHeader}>
//         <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.primary} /></TouchableOpacity>
//         <Image source={{ uri: contact.avatar }} style={styles.chatHeaderAvatar} />
//         <View><Text style={styles.chatHeaderName}>{contact.name}</Text><Text style={styles.chatHeaderStatus}>Online</Text></View>
//       </View>
//       <FlatList ref={flatListRef} data={messages} keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//         onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
//         renderItem={({ item }) => (
//           <View style={[styles.msgBubble, item.sender === "me" ? styles.msgMe : styles.msgThem]}>
//             <Text style={item.sender === "me" ? styles.msgTextMe : styles.msgTextThem}>{item.text}</Text>
//             <Text style={styles.msgTime}>{item.time}</Text>
//           </View>
//         )} />
//       <View style={styles.inputArea}>
//         <TextInput style={styles.chatInput} placeholder="Type a message..." value={input} onChangeText={setInput} />
//         <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}><Ionicons name="send" size={20} color={COLORS.white} /></TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  AI CHATBOT
// // ═══════════════════════════════════════════════════════════════
// function AIChatbotScreen() {
//   const navigation = useNavigation<any>();
//   const [messages, setMessages] = useState([{ id: 1, text: "Hello! I am your Industry CXbot. How can I help?", sender: "bot" }]);
//   const [typing, setTyping] = useState(false);
//   const [input, setInput] = useState("");
//   const flatListRef = useRef<FlatList>(null);

//   const handleSend = (text: string) => {
//     if (!text.trim()) return;
//     setMessages(prev => [...prev, { id: Date.now(), text, sender: "user" }]);
//     setInput(""); setTyping(true);
//     setTimeout(() => {
//       let botReply = "I can help with that. Please provide more details.";
//       const t = text.toLowerCase();
//       if (t.includes("mou"))         botReply = "Manage all your MoUs in the MoUs section. You can respond, propose changes, or confirm meetings.";
//       if (t.includes("internship"))  botReply = "Post and manage internships in the Internships section.";
//       if (t.includes("meeting"))     botReply = "Meeting management is in MOU detail under the Meeting tab.";
//       if (t.includes("project"))     botReply = "Add and manage your research projects in the Projects section.";
//       if (t.includes("profile"))     botReply = "Update your company profile from the Profile section in the drawer menu.";
//       setMessages(prev => [...prev, { id: Date.now() + 1, text: botReply, sender: "bot" }]);
//       setTyping(false);
//     }, 2000);
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screenContainer}>
//       <Header title="CXbot" back={true} />
//       <FlatList ref={flatListRef} data={messages} keyExtractor={item => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//         onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
//         renderItem={({ item }) => (
//           <View style={[styles.aiBubble, item.sender === "user" ? styles.aiUser : styles.aiBot]}>
//             {item.sender === "bot" && <View style={styles.aiIcon}><Ionicons name="sparkles" size={14} color={COLORS.white} /></View>}
//             <Text style={item.sender === "user" ? styles.aiUserText : styles.aiBotText}>{item.text}</Text>
//           </View>
//         )}
//         ListFooterComponent={typing ? <Text style={{ marginLeft: 20, color: COLORS.textLight }}>AI is typing...</Text> : null}
//       />
//       <View style={styles.inputArea}>
//         <TextInput style={styles.chatInput} placeholder="Ask CXbot anything..." value={input} onChangeText={setInput} />
//         <TouchableOpacity style={[styles.sendBtn, { backgroundColor: COLORS.secondary }]} onPress={() => handleSend(input)}>
//           <Ionicons name="arrow-up" size={24} color={COLORS.white} />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  INTERNSHIPS
// // ═══════════════════════════════════════════════════════════════
// function InternshipsMainScreen() {
//   const navigation = useNavigation<any>();
//   const { ax } = useUser();
//   const [internships, setInternships] = useState<any[]>([]);
//   const [ld, setLd] = useState(true);

//   const load = useCallback(() => {
//     ax().get(API_INT)
//       .then(r => setInternships(r.data || []))
//       .catch(() => {})
//       .finally(() => setLd(false));
//   }, [ax]);

//   useEffect(() => { load(); }, []);

//   if (ld) return <View style={[styles.screenContainer, { justifyContent: "center", alignItems: "center" }]}><ActivityIndicator color={COLORS.primary} size="large" /></View>;

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Internships" back={true} />
//       <ScrollView contentContainerStyle={{ padding: 16 }}>
//         <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("PostNewInternship")}>
//           <Ionicons name="add-circle" size={24} color={COLORS.white} />
//           <Text style={styles.createButtonText}>Post New Internship</Text>
//         </TouchableOpacity>
//         <Text style={styles.sectionHeader}>Active Listings</Text>
//         {internships.length === 0 && (
//           <View style={{ alignItems: "center", paddingVertical: 40 }}>
//             <Ionicons name="briefcase-outline" size={48} color={COLORS.textLight} />
//             <Text style={{ color: COLORS.textLight, textAlign: "center", marginTop: 12, fontSize: 15 }}>No internships yet.</Text>
//             <Text style={{ color: COLORS.textLight, textAlign: "center", fontSize: 13 }}>Post your first one!</Text>
//           </View>
//         )}
//         {internships.map((item: any) => (
//           <View key={item._id || item.id} style={styles.jobCard}>
//             <Image source={{ uri: item.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" }} style={styles.jobCardImage} />
//             <View style={styles.jobCardContent}>
//               <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                 <Text style={styles.jobCardTitle}>{item.title}</Text>
//                 <View style={styles.activeTag}><Text style={styles.activeTagText}>Active</Text></View>
//               </View>
//               <Text style={styles.jobCardCompany}>{item.company}</Text>
//               <View style={styles.jobFooter}>
//                 <Text style={styles.jobDate}>Posted: {fmtDate(item.date || item.createdAt)}</Text>
//                 <Text style={styles.jobApps}>{item.applications || 0} Applicants</Text>
//               </View>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// function PostNewInternshipScreen() {
//   const navigation = useNavigation<any>();
//   const { user, ax } = useUser();
//   const toast = useToast();
//   const [title,  setTitle]  = useState("");
//   const [skills, setSkills] = useState("");
//   const [desc,   setDesc]   = useState("");
//   const [image,  setImage]  = useState<string | null>(null);
//   const [ld,     setLd]     = useState(false);

//   const pickImage = async () => {
//     const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [16, 9], quality: 1 });
//     if (!r.canceled) setImage(r.assets[0].uri);
//   };

//   const submit = async () => {
//     if (!title) { toast("Title required", "error"); return; }
//     setLd(true);
//     try {
//       await ax().post(API_INT, { title, company: user?.name || "", skills, description: desc,
//         image: image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" });
//       toast("Internship posted!", "success");
//       navigation.goBack();
//     } catch (e: any) { toast(e?.response?.data?.message || "Error posting internship", "error"); }
//     finally { setLd(false); }
//   };

//   return (
//     <ScrollView style={styles.screenContainer}>
//       <Header title="New Internship" back={true} />
//       <View style={styles.formContainer}>
//         <TouchableOpacity style={styles.bannerUpload} onPress={pickImage}>
//           {image ? <Image source={{ uri: image }} style={styles.uploadedBanner} />
//             : <View style={styles.uploadPlaceholder}><Ionicons name="image-outline" size={40} color={COLORS.textLight} /><Text style={styles.uploadText}>Upload Cover Image</Text></View>}
//         </TouchableOpacity>
//         <Text style={styles.formLabel}>Job Title</Text>
//         <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. React Developer" placeholderTextColor={COLORS.textLight} />
//         <Text style={styles.formLabel}>Required Skills</Text>
//         <TextInput style={styles.input} value={skills} onChangeText={setSkills} placeholder="e.g. JavaScript, React" placeholderTextColor={COLORS.textLight} />
//         <Text style={styles.formLabel}>Job Details / Description</Text>
//         <TextInput style={[styles.input, styles.textArea]} value={desc} onChangeText={setDesc}
//           placeholder="Responsibilities, requirements..." placeholderTextColor={COLORS.textLight} multiline />
//         <TouchableOpacity style={[styles.primaryButton, ld && { opacity: 0.7 }]} onPress={submit} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Publish Internship</Text>}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MOU LIST SCREEN
// // ═══════════════════════════════════════════════════════════════
// function MoUScreen() {
//   const navigation = useNavigation<any>();
//   const { ax } = useUser();
//   const [mous, setMous] = useState<any[]>([]);
//   const [ld,   setLd]   = useState(true);
//   const [ref,  setRef]  = useState(false);

//   const load = useCallback(async (show = true) => {
//     if (show) setLd(true);
//     try { const r = await ax().get(`${API_MOUS}/mine`); setMous((r.data || []).map(normMou)); }
//     catch {} finally { setLd(false); setRef(false); }
//   }, [ax]);

//   useEffect(() => { load(); }, []);

//   if (ld) return <View style={[styles.screenContainer, { justifyContent: "center", alignItems: "center" }]}><ActivityIndicator color={COLORS.primary} size="large" /></View>;

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="MoUs" back={true} />
//       <View style={{ padding: 16, paddingBottom: 0 }}>
//         <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("CreateMoU")}>
//           <Ionicons name="add-circle" size={22} color={COLORS.white} />
//           <Text style={styles.createButtonText}>Request New MoU</Text>
//         </TouchableOpacity>
//       </View>
//       <FlatList data={mous} keyExtractor={m => m._id}
//         contentContainerStyle={{ padding: 16 }}
//         refreshControl={<RefreshControl refreshing={ref} onRefresh={() => { setRef(true); load(false); }} tintColor={COLORS.primary} />}
//         ListEmptyComponent={
//           <View style={{ alignItems: "center", paddingVertical: 40 }}>
//             <Ionicons name="document-text-outline" size={48} color={COLORS.textLight} />
//             <Text style={{ color: COLORS.textLight, textAlign: "center", marginTop: 12, fontSize: 15 }}>No MoUs yet.</Text>
//             <Text style={{ color: COLORS.textLight, fontSize: 13 }}>Request your first one!</Text>
//           </View>
//         }
//         renderItem={({ item: m }) => (
//           <TouchableOpacity
//             style={[styles.mouCard, ["Sent to Industry", "Changes Proposed"].includes(m.status) && { borderLeftWidth: 4, borderLeftColor: COLORS.primary }]}
//             onPress={() => navigation.navigate("MouDetail", { mouId: m._id })}
//             activeOpacity={0.85}>
//             <View style={styles.mouHeader}>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.mouUni}>{m.title || m.university}</Text>
//                 <Text style={styles.mouDept}>{m.university}</Text>
//               </View>
//               <SBadge status={m.status} />
//             </View>
//             <Text style={styles.mouType}>{m.collaborationType}</Text>
//             <View style={styles.mouFooter}>
//               <Text style={styles.dateLabel}>{fmtDate(m.startDate)} → {fmtDate(m.endDate)}</Text>
//             </View>
//             {m.meetingConfirmedSlot?.date && (
//               <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8, backgroundColor: "#f0fdf4", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: "flex-start" }}>
//                 <Ionicons name="checkmark-circle" size={11} color="#16a34a" />
//                 <Text style={{ fontSize: 11, color: "#16a34a", fontWeight: "600" }}>Meeting: {m.meetingConfirmedSlot.date}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         )} />
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  CREATE MOU SCREEN
// // ═══════════════════════════════════════════════════════════════
// function CreateMoUScreen() {
//   const navigation = useNavigation<any>();
//   const { user, ax } = useUser();
//   const toast = useToast();
//   const [dept,     setDept]     = useState("");
//   const [type,     setType]     = useState("");
//   const [desc,     setDesc]     = useState("");
//   const [title,    setTitle]    = useState("");
//   const [duration, setDuration] = useState("1 Year");
//   const [ld,       setLd]       = useState(false);

//   const handleCreate = async () => {
//     if (!dept || !type) { Alert.alert("Missing Details", "Please specify the department and collaboration type."); return; }
//     setLd(true);
//     try {
//       const cl = addCL({ changeLog: [] }, "university_change", { party: "Industry", message: `MOU "${title || dept}" created` });
//       await ax().post(API_MOUS, {
//         title: title || dept, university: "Riphah International University",
//         collaborationType: type, description: desc,
//         industry: user?.name || "", industryId: user?._id,
//         industryLogo: user?.logo || "", status: "Draft", changeLog: cl,
//         startDate: new Date().toISOString().split("T")[0],
//         endDate: new Date(new Date().setFullYear(new Date().getFullYear() + (duration === "1 Year" ? 1 : 2))).toISOString().split("T")[0],
//       });
//       toast("MoU request sent!", "success");
//       navigation.goBack();
//     } catch (e: any) { toast(e?.response?.data?.message || "Error sending request", "error"); }
//     finally { setLd(false); }
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screenContainer}>
//       <Header title="Request MoU" back={true} />
//       <ScrollView contentContainerStyle={styles.formContainer}>
//         <Text style={styles.formLabel}>Title</Text>
//         <TextInput style={styles.input} placeholder="MOU Title" placeholderTextColor={COLORS.textLight} value={title} onChangeText={setTitle} />
//         <Text style={styles.formLabel}>University</Text>
//         <TextInput style={[styles.input, { backgroundColor: "#F3F4F6" }]} value="Riphah International University" editable={false} />
//         <Text style={styles.formLabel}>Department *</Text>
//         <TextInput style={styles.input} placeholder="e.g. Software Engineering Department" placeholderTextColor={COLORS.textLight} value={dept} onChangeText={setDept} />
//         <Text style={styles.formLabel}>Collaboration Type *</Text>
//         <TextInput style={styles.input} placeholder="e.g. Research, Internship Drive" placeholderTextColor={COLORS.textLight} value={type} onChangeText={setType} />
//         <Text style={styles.formLabel}>Proposal / Description</Text>
//         <TextInput style={[styles.input, styles.textArea]} placeholder="Briefly describe objectives..." placeholderTextColor={COLORS.textLight} multiline numberOfLines={5} value={desc} onChangeText={setDesc} />
//         <Text style={styles.formLabel}>Duration</Text>
//         <View style={{ flexDirection: "row", gap: 10 }}>
//           {["1 Year", "2 Years"].map(d => (
//             <TouchableOpacity key={d} onPress={() => setDuration(d)}
//               style={[styles.durationBtn, duration === d && styles.durationBtnActive]}>
//               <Text style={duration === d ? styles.durationTextActive : styles.durationText}>{d}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <TouchableOpacity style={[styles.primaryButton, ld && { opacity: 0.7 }]} onPress={handleCreate} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Submit Request</Text>}
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MOU DETAIL SCREEN
// // ═══════════════════════════════════════════════════════════════
// function MouDetailScreen({ route }: any) {
//   const nav = useNavigation<any>();
//   const { ax } = useUser();
//   const toast = useToast();
//   const [mou,   setMou]  = useState<any>(null);
//   const [ld,    setLd]   = useState(true);
//   const [actLd, setActLd]= useState(false);
//   const [tab,   setTab]  = useState<"info" | "meeting" | "activity">("info");
//   const [rModal, setRM]  = useState(false);
//   const [mModal, setMM]  = useState(false);
//   const mouId = route.params?.mouId;

//   useEffect(() => {
//     ax().get(`${API_MOUS}/${mouId}`).then(r => setMou(normMou(r.data))).catch(() => {}).finally(() => setLd(false));
//   }, [mouId]);

//   const upd = (u: any) => setMou(normMou(u));

//   const doResponse = async (rd: any) => {
//     setActLd(true);
//     try {
//       const lt = rd.type === "accept" ? "industry_approve" : rd.type === "reject" ? "industry_reject" : rd.type === "change" ? "industry_change" : "industry_response";
//       const cl = addCL(mou, lt, { party: "Industry", from: mou.industry, message: rd.message });
//       let ns = mou.status;
//       if (rd.type === "accept") ns = "Approved by Industry";
//       else if (rd.type === "reject") ns = "Rejected";
//       else if (rd.type === "change") ns = "Changes Proposed";
//       else ns = "Industry Responded";
//       const stamp = rd.type === "accept" ? { by: mou.industry, type: "approve", date: new Date().toISOString() } : mou.industryStamp;
//       const pl = { ...bldPayload(mou), status: ns, changeLog: cl, industryStamp: stamp, industryResponseAt: new Date().toISOString(),
//         proposedChanges: rd.changes ? [...(mou.proposedChanges || []), ...rd.changes] : (mou.proposedChanges || []) };
//       const r = await ax().put(`${API_MOUS}/${mou._id}`, pl);
//       upd({ ...r.data, ...pl }); setRM(false);
//       toast(rd.type === "accept" ? "🎉 MOU Approved!" : rd.type === "reject" ? "MOU Rejected" : "Response sent", rd.type === "reject" ? "error" : "success");
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setActLd(false); }
//   };

//   const selSlot = async (opt: any) => {
//     const sl = { date: opt.date || "", time: opt.time || "", note: opt.note || "" };
//     const now = new Date().toISOString(); setActLd(true);
//     try {
//       const cl = addCL(mou, "meeting_confirmed", { party: "Industry", from: mou.industry, message: `Confirmed: ${sl.date} at ${sl.time}` });
//       const pl = { ...bldPayload(mou), scheduledMeeting: { ...mou.scheduledMeeting, industryProposedSlot: null },
//         meetingConfirmedSlot: sl, meetingConfirmedAt: now, changeLog: cl };
//       const r = await ax().put(`${API_MOUS}/${mou._id}`, pl);
//       upd({ ...r.data, meetingConfirmedSlot: sl, meetingConfirmedAt: now });
//       toast(`🤝 Meeting confirmed: ${sl.date}!`, "success");
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setActLd(false); }
//   };

//   const propSlot = async (sd: any) => {
//     const prop = { date: sd.date || "", time: sd.time || "", note: sd.note || "" };
//     const now = new Date().toISOString(); setActLd(true);
//     try {
//       const cl = addCL(mou, "meeting_proposed", { party: "Industry", from: mou.industry, message: `Proposed: ${prop.date} at ${prop.time}` });
//       const pl = { ...bldPayload(mou), scheduledMeeting: { ...mou.scheduledMeeting, industryProposedSlot: null },
//         meetingIndustryProposedSlot: prop, meetingIndustryProposedAt: now, meetingConfirmedSlot: null, meetingConfirmedAt: null, changeLog: cl };
//       const r = await ax().put(`${API_MOUS}/${mou._id}`, pl);
//       upd({ ...r.data, meetingIndustryProposedSlot: prop, meetingIndustryProposedAt: now, meetingConfirmedSlot: null, meetingConfirmedAt: null });
//       setMM(false); toast("Slot proposed to University", "info");
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setActLd(false); }
//   };

//   if (ld) return <View style={[styles.screenContainer, { justifyContent: "center", alignItems: "center" }]}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
//   if (!mou) return <View style={styles.screenContainer}><Header title="MOU" back /></View>;

//   const mtg = mou.scheduledMeeting;
//   const cs = mou.meetingConfirmedSlot, hasC = !!(cs?.date);
//   const ip = mou.meetingIndustryProposedSlot, hasI = !!(ip?.date);
//   const hasOpts = mtg?.options?.length > 0, hasSingle = mtg?.date && mtg?.time;
//   const canResp = ["Sent to Industry", "Changes Proposed"].includes(mou.status);

//   return (
//     <View style={styles.screenContainer}>
//       <Header title={mou.title || "MOU Detail"} back />
//       <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: COLORS.border }}>
//         <SBadge status={mou.status} />
//         <Text style={{ fontSize: 11, color: COLORS.textLight }}>Created: {fmtDate(mou.createdAt)}</Text>
//       </View>

//       {canResp && (
//         <View style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: COLORS.border }}>
//           <TouchableOpacity style={styles.primaryButton} onPress={() => setRM(true)} disabled={actLd}>
//             {actLd ? <ActivityIndicator color="#fff" size="small" />
//               : <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
//                   <Ionicons name="chatbubble-ellipses" size={15} color="#fff" />
//                   <Text style={styles.primaryButtonText}>Send Response to University</Text>
//                 </View>}
//           </TouchableOpacity>
//         </View>
//       )}

//       <View style={{ flexDirection: "row", backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: COLORS.border }}>
//         {(["info", "meeting", "activity"] as const).map(t => (
//           <TouchableOpacity key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]} onPress={() => setTab(t)}>
//             <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>
//               {t === "info" ? "Details" : t === "meeting" ? "Meeting" : "Activity"}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 50 }} showsVerticalScrollIndicator={false}>

//         {tab === "info" && <>
//           <View style={styles.mouCard}><Text style={styles.formLabel}>Collaboration Type</Text><Text>{mou.collaborationType || "—"}</Text></View>
//           <View style={styles.mouCard}><Text style={styles.formLabel}>Duration</Text><Text>{fmtDate(mou.startDate)} → {fmtDate(mou.endDate)}</Text></View>
//           {mou.description && <View style={styles.mouCard}><Text style={styles.formLabel}>Purpose</Text><Text>{mou.description}</Text></View>}
//           {mou.objectives?.filter(Boolean).length > 0 && (
//             <View style={styles.mouCard}>
//               <Text style={styles.formLabel}>Objectives</Text>
//               {mou.objectives.filter(Boolean).map((o: string, i: number) => <Text key={i} style={{ fontSize: 13, color: COLORS.text, marginBottom: 3 }}>• {o}</Text>)}
//             </View>
//           )}
//           {mou.proposedChanges?.length > 0 && (
//             <View style={[styles.mouCard, { borderLeftWidth: 3, borderLeftColor: "#7c3aed" }]}>
//               <Text style={[styles.formLabel, { color: "#7c3aed" }]}>⚠️ {mou.proposedChanges.length} Proposed Change(s)</Text>
//               {mou.proposedChanges.map((c: any, i: number) => (
//                 <View key={i} style={{ backgroundColor: "#f5f3ff", borderRadius: 8, padding: 10, marginBottom: 6 }}>
//                   <Text style={{ fontSize: 12, fontWeight: "700", color: "#7c3aed" }}>📝 {c.field || `#${i + 1}`}</Text>
//                   <Text style={{ fontSize: 12 }}>
//                     <Text style={{ textDecorationLine: "line-through", color: COLORS.danger }}>{c.oldValue}</Text>
//                     {"  →  "}
//                     <Text style={{ color: "#16a34a" }}>{c.newValue}</Text>
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           )}
//         </>}

//         {tab === "meeting" && <>
//           {!mtg && <View style={{ alignItems: "center", paddingVertical: 40 }}><Ionicons name="calendar-outline" size={44} color={COLORS.textLight} /><Text style={{ color: COLORS.textLight, marginTop: 10, fontSize: 15 }}>No meeting scheduled yet</Text><Text style={{ color: COLORS.textLight, fontSize: 13 }}>University will propose a time.</Text></View>}
//           {mtg && <>
//             {hasC && (
//               <View style={styles.confCard}>
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
//                   <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
//                   <Text style={{ fontSize: 15, fontWeight: "800", color: "#166534" }}>🤝 Meeting Confirmed!</Text>
//                 </View>
//                 <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
//                   <View style={styles.ccell}><Text style={styles.ccLbl}>DATE</Text><Text style={styles.ccVal}>{cs!.date}</Text></View>
//                   <View style={styles.ccell}><Text style={styles.ccLbl}>TIME</Text><Text style={styles.ccVal}>🕐 {cs!.time}</Text></View>
//                 </View>
//                 {mtg.venue && <Text style={{ fontSize: 12, color: COLORS.textLight }}>📍 {mtg.venue}</Text>}
//                 <Text style={{ fontSize: 10, color: "#6b7280", marginTop: 6 }}>Confirmed: {fmtDT(mou.meetingConfirmedAt)}</Text>
//               </View>
//             )}
//             {!hasC && hasI && (
//               <View style={styles.pendCard}>
//                 <Text style={{ fontSize: 14, fontWeight: "700", color: "#92400e", marginBottom: 6 }}>⏳ Awaiting University Confirmation</Text>
//                 <Text style={{ fontSize: 12, color: "#a16207", marginBottom: 10 }}>You proposed:</Text>
//                 <View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
//                   <View style={[styles.ccell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}><Text style={[styles.ccLbl, { color: "#92400e" }]}>DATE</Text><Text style={[styles.ccVal, { color: "#92400e" }]}>{ip!.date}</Text></View>
//                   <View style={[styles.ccell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}><Text style={[styles.ccLbl, { color: "#92400e" }]}>TIME</Text><Text style={[styles.ccVal, { color: "#92400e" }]}>🕐 {ip!.time}</Text></View>
//                 </View>
//                 <TouchableOpacity style={styles.outlineBtn} onPress={() => setMM(true)}>
//                   <Ionicons name="pencil" size={13} color={COLORS.primary} />
//                   <Text style={styles.outlineBtnTxt}>Change Slot</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//             {!hasC && !hasI && hasOpts && <>
//               <Text style={{ fontSize: 13, color: "#0284c7", fontWeight: "600", marginBottom: 12 }}>📋 Select a time or propose your own:</Text>
//               {mtg.options.map((opt: any, i: number) => (
//                 <View key={i} style={[styles.mouCard, { flexDirection: "row", alignItems: "center" }]}>
//                   <View style={{ flex: 1 }}>
//                     <Text style={{ fontSize: 13, fontWeight: "600", color: COLORS.primary }}>{opt.date} at {opt.time}</Text>
//                     {opt.note && <Text style={{ fontSize: 11, color: COLORS.textLight }}>{opt.note}</Text>}
//                   </View>
//                   <TouchableOpacity style={styles.selBtn} onPress={() => selSlot(opt)} disabled={actLd}>
//                     <Ionicons name="checkmark" size={13} color="#fff" />
//                     <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Select</Text>
//                   </TouchableOpacity>
//                 </View>
//               ))}
//               <TouchableOpacity style={styles.outlineBtn} onPress={() => setMM(true)}>
//                 <Ionicons name="pencil" size={13} color={COLORS.primary} />
//                 <Text style={styles.outlineBtnTxt}>Propose Different Slot</Text>
//               </TouchableOpacity>
//             </>}
//             {!hasC && !hasI && !hasOpts && hasSingle && <>
//               <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: "600", marginBottom: 12 }}>📅 University proposed this meeting:</Text>
//               <View style={styles.mouCard}>
//                 <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.primary }}>{fmtDate(mtg.date)} at {mtg.time}</Text>
//                 {mtg.venue && <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>📍 {mtg.venue}</Text>}
//               </View>
//               <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
//                 <TouchableOpacity style={[styles.selBtn, { flex: 1, justifyContent: "center", paddingVertical: 12 }]}
//                   onPress={() => selSlot({ date: mtg.date, time: mtg.time, note: "" })} disabled={actLd}>
//                   <Ionicons name="checkmark-circle" size={14} color="#fff" />
//                   <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Confirm This Slot</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.outlineBtn, { flex: 1, justifyContent: "center" }]} onPress={() => setMM(true)}>
//                   <Ionicons name="pencil" size={13} color={COLORS.primary} />
//                   <Text style={styles.outlineBtnTxt}>Propose New Slot</Text>
//                 </TouchableOpacity>
//               </View>
//             </>}
//           </>}
//         </>}

//         {tab === "activity" && <>
//           {hasC && (
//             <View style={[styles.confCard, { marginBottom: 16 }]}>
//               <Text style={{ fontSize: 13, fontWeight: "700", color: "#166534", marginBottom: 8 }}>✅ Meeting Confirmed</Text>
//               <View style={{ flexDirection: "row", gap: 10 }}>
//                 <View style={styles.ccell}><Text style={styles.ccLbl}>DATE</Text><Text style={styles.ccVal}>{cs!.date}</Text></View>
//                 <View style={styles.ccell}><Text style={styles.ccLbl}>TIME</Text><Text style={styles.ccVal}>🕐 {cs!.time}</Text></View>
//               </View>
//             </View>
//           )}
//           <Text style={styles.sectionHeader}>Timeline</Text>
//           {[
//             { lbl: "Draft Created",     date: mou.createdAt,          done: true },
//             { lbl: "Sent to Industry",  date: mou.sentAt,             done: !!mou.sentAt },
//             { lbl: "Our Response",      date: mou.industryResponseAt, done: !!mou.industryResponseAt },
//             { lbl: "Meeting Confirmed", date: mou.meetingConfirmedAt, done: hasC },
//             { lbl: "Mutually Approved", date: null,                   done: mou.status === "Mutually Approved" },
//           ].map((t, i) => (
//             <View key={i} style={{ flexDirection: "row", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
//               <View style={[styles.tlDot, { backgroundColor: t.done ? "#16a34a" : COLORS.border }]}>
//                 {t.done && <Ionicons name="checkmark" size={10} color="#fff" />}
//               </View>
//               <View>
//                 <Text style={{ fontSize: 13, fontWeight: "600", color: t.done ? COLORS.primary : COLORS.textLight }}>{t.lbl}</Text>
//                 {t.date && <Text style={{ fontSize: 11, color: COLORS.textLight }}>{fmtDate(t.date)}</Text>}
//               </View>
//             </View>
//           ))}

//           {(mou.changeLog || []).length > 0 && <>
//             <Text style={[styles.sectionHeader, { marginTop: 16 }]}>All Activity</Text>
//             {[...(mou.changeLog || [])].reverse().map((e: any, i: number) => {
//               const c = CT[e.type] || { c: COLORS.textLight, bg: "#f1f5f9", ic: "📌", lbl: e.type };
//               return (
//                 <View key={e.id || i} style={[styles.logEntry, { backgroundColor: c.bg, borderColor: c.c + "30" }]}>
//                   <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
//                     <Text style={{ fontSize: 14 }}>{c.ic}</Text>
//                     <Text style={{ fontSize: 11, fontWeight: "700", color: c.c }}>{c.lbl}</Text>
//                     <Text style={{ marginLeft: "auto", fontSize: 10, color: COLORS.textLight }}>{e.party}</Text>
//                   </View>
//                   {e.message && <Text style={{ fontSize: 12, color: COLORS.text, lineHeight: 17 }}>{e.message}</Text>}
//                   <Text style={{ fontSize: 10, color: COLORS.textLight, marginTop: 4 }}>{fmtDT(e.date)}</Text>
//                 </View>
//               );
//             })}
//           </>}
//         </>}
//       </ScrollView>

//       <RespModal    visible={rModal} mou={mou} onClose={() => setRM(false)} onSave={doResponse} loading={actLd} />
//       <PropMtgModal visible={mModal} mou={mou} onClose={() => setMM(false)} onSave={propSlot}   loading={actLd} />
//     </View>
//   );
// }

// // ─── Response Modal ─────────────────────────────────────────────
// const RespModal = ({ visible, mou, onClose, onSave, loading }: any) => {
//   const [type, setType] = useState<"accept" | "reject" | "comment" | "change">("comment");
//   const [msg,  setMsg]  = useState("");
//   const [changes, setChanges] = useState([{ field: "", oldValue: "", newValue: "", reason: "" }]);
//   const cfg = {
//     accept:  { c: "#16a34a", bg: "#f0fdf4", lbl: "Accept MOU",      ic: "thumbs-up" },
//     reject:  { c: "#dc2626", bg: "#fef2f2", lbl: "Reject MOU",      ic: "thumbs-down" },
//     comment: { c: "#0284c7", bg: "#eff6ff", lbl: "Comment",         ic: "chatbubble" },
//     change:  { c: "#7c3aed", bg: "#f5f3ff", lbl: "Propose Changes", ic: "refresh" },
//   };
//   const go = () => {
//     if (!msg.trim() && type !== "accept" && type !== "reject") { Alert.alert("Required", "Enter a message."); return; }
//     onSave({ type, message: msg || (type === "accept" ? `${mou?.industry} accepted.` : `${mou?.industry} rejected.`),
//       changes: type === "change" ? changes.filter(c => c.field).map(c => ({ ...c, date: new Date().toISOString() })) : undefined });
//   };
//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.sheet}>
//           <View style={styles.shHandle} />
//           <View style={styles.shHead}><Text style={styles.shTitle}>Response — {mou?.industry}</Text><TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={COLORS.text} /></TouchableOpacity></View>
//           <ScrollView contentContainerStyle={{ padding: 16 }}>
//             <Text style={styles.formLabel}>Response Type</Text>
//             <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14, marginTop: 6 }}>
//               {(Object.keys(cfg) as Array<keyof typeof cfg>).map(k => (
//                 <TouchableOpacity key={k} style={[styles.rtBtn, type === k && { borderColor: cfg[k].c, backgroundColor: cfg[k].bg }]} onPress={() => setType(k)}>
//                   <Ionicons name={cfg[k].ic as any} size={14} color={type === k ? cfg[k].c : COLORS.textLight} />
//                   <Text style={[{ fontSize: 12, fontWeight: "600", color: COLORS.textLight }, type === k && { color: cfg[k].c }]}>{cfg[k].lbl}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <Text style={styles.formLabel}>Message</Text>
//             <TextInput style={[styles.input, { height: 90, textAlignVertical: "top" }]} value={msg} onChangeText={setMsg}
//               placeholder={type === "accept" ? "Note (optional)..." : "Your message..."} placeholderTextColor={COLORS.textLight} multiline />
//             {type === "change" && <>
//               <Text style={[styles.formLabel, { color: "#7c3aed" }]}>Proposed Changes</Text>
//               {changes.map((c, i) => (
//                 <View key={i} style={{ backgroundColor: "#f5f3ff", borderRadius: 10, padding: 12, marginBottom: 10, gap: 6 }}>
//                   <TextInput style={styles.input} placeholder="Field / Section" placeholderTextColor={COLORS.textLight} value={c.field} onChangeText={v => { const a = [...changes]; a[i].field = v; setChanges(a); }} />
//                   <View style={{ flexDirection: "row", gap: 8 }}>
//                     <TextInput style={[styles.input, { flex: 1 }]} placeholder="Current" placeholderTextColor={COLORS.textLight} value={c.oldValue} onChangeText={v => { const a = [...changes]; a[i].oldValue = v; setChanges(a); }} />
//                     <TextInput style={[styles.input, { flex: 1 }]} placeholder="New value" placeholderTextColor={COLORS.textLight} value={c.newValue} onChangeText={v => { const a = [...changes]; a[i].newValue = v; setChanges(a); }} />
//                   </View>
//                   <TextInput style={styles.input} placeholder="Reason" placeholderTextColor={COLORS.textLight} value={c.reason} onChangeText={v => { const a = [...changes]; a[i].reason = v; setChanges(a); }} />
//                 </View>
//               ))}
//               <TouchableOpacity onPress={() => setChanges(c => [...c, { field: "", oldValue: "", newValue: "", reason: "" }])}>
//                 <Text style={{ color: "#7c3aed", fontWeight: "700", textAlign: "center", marginBottom: 10 }}>+ Add Change</Text>
//               </TouchableOpacity>
//             </>}
//           </ScrollView>
//           <View style={styles.shFoot}>
//             <TouchableOpacity style={{ paddingHorizontal: 18, justifyContent: "center" }} onPress={onClose}>
//               <Text style={{ color: COLORS.textLight, fontSize: 14, fontWeight: "600" }}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.primaryButton, { flex: 1, backgroundColor: cfg[type].c }]} onPress={go} disabled={loading}>
//               {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.primaryButtonText}>Submit</Text>}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ─── Propose Meeting Modal ──────────────────────────────────────
// const PropMtgModal = ({ visible, mou, onClose, onSave, loading }: any) => {
//   const [date, setDate] = useState(""), [time, setTime] = useState(""), [note, setNote] = useState("");
//   const mtg = mou?.scheduledMeeting;
//   const use = (o: any) => { setDate(o.date || ""); setTime(o.time || ""); setNote(o.note || ""); };
//   const go = () => { if (!date || !time) { Alert.alert("Required", "Enter date and time."); return; } onSave({ date, time, note }); };
//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.sheet}>
//           <View style={styles.shHandle} />
//           <View style={styles.shHead}><Text style={styles.shTitle}>Propose Meeting Slot</Text><TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={COLORS.text} /></TouchableOpacity></View>
//           <ScrollView contentContainerStyle={{ padding: 16 }}>
//             <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#eff6ff", padding: 12, borderRadius: 10, marginBottom: 14 }}>
//               <Ionicons name="information-circle" size={16} color="#0284c7" />
//               <Text style={{ fontSize: 12, color: "#0284c7", flex: 1 }}>University will review and confirm your proposed slot.</Text>
//             </View>
//             {mtg?.options?.length > 0 && <>
//               <Text style={styles.formLabel}>University's options (tap to use):</Text>
//               {mtg.options.map((o: any, i: number) => (
//                 <TouchableOpacity key={i} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f0f9ff", borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: "#bae6fd" }} onPress={() => use(o)}>
//                   <Text style={{ fontSize: 13, color: "#0284c7", fontWeight: "600" }}>{o.date} at {o.time}</Text>
//                   <Text style={{ fontSize: 11, color: "#0284c7", fontWeight: "700" }}>Use</Text>
//                 </TouchableOpacity>
//               ))}
//             </>}
//             {mtg?.date && !mtg?.options?.length && (
//               <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f0f9ff", borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: "#bae6fd" }} onPress={() => use({ date: mtg.date, time: mtg.time })}>
//                 <Text style={{ fontSize: 13, color: "#0284c7", fontWeight: "600" }}>{fmtDate(mtg.date)} at {mtg.time}</Text>
//                 <Text style={{ fontSize: 11, color: "#0284c7", fontWeight: "700" }}>Use</Text>
//               </TouchableOpacity>
//             )}
//             <Text style={styles.formLabel}>Your Preferred Date *</Text>
//             <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={COLORS.textLight} value={date} onChangeText={setDate} />
//             <Text style={styles.formLabel}>Your Preferred Time *</Text>
//             <TextInput style={styles.input} placeholder="HH:MM" placeholderTextColor={COLORS.textLight} value={time} onChangeText={setTime} />
//             <Text style={styles.formLabel}>Note (optional)</Text>
//             <TextInput style={styles.input} placeholder="e.g. Prefer morning" placeholderTextColor={COLORS.textLight} value={note} onChangeText={setNote} />
//           </ScrollView>
//           <View style={styles.shFoot}>
//             <TouchableOpacity style={{ paddingHorizontal: 18, justifyContent: "center" }} onPress={onClose}>
//               <Text style={{ color: COLORS.textLight, fontSize: 14, fontWeight: "600" }}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.primaryButton, { flex: 1 }]} onPress={go} disabled={loading}>
//               {loading ? <ActivityIndicator color="#fff" size="small" />
//                 : <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><Ionicons name="send" size={13} color="#fff" /><Text style={styles.primaryButtonText}>Submit to University</Text></View>}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// //  MANAGE PROJECTS
// // ═══════════════════════════════════════════════════════════════
// function ManageProjects() {
//   const navigation = useNavigation<any>();
//   const { ax } = useUser();
//   const [projects, setProjects] = useState<any[]>([]);
//   const [ld, setLd] = useState(true);

//   useEffect(() => {
//     ax().get(API_PROJ)
//       .then(r => setProjects(r.data || []))
//       .catch(() => {})
//       .finally(() => setLd(false));
//   }, []);

//   if (ld) return <View style={[styles.screenContainer, { justifyContent: "center", alignItems: "center" }]}><ActivityIndicator color={COLORS.primary} size="large" /></View>;

//   return (
//     <View style={styles.screenContainer}>
//       <Header title="Projects" back={true} />
//       <ScrollView contentContainerStyle={{ padding: 16 }}>
//         <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("PostNewProject" as any)}>
//           <Ionicons name="add" size={24} color="#fff" />
//           <Text style={styles.createButtonText}>Add New Project</Text>
//         </TouchableOpacity>
//         {projects.length === 0 && (
//           <View style={{ alignItems: "center", paddingVertical: 40 }}>
//             <Ionicons name="flask-outline" size={48} color={COLORS.textLight} />
//             <Text style={{ color: COLORS.textLight, textAlign: "center", marginTop: 12, fontSize: 15 }}>No projects yet.</Text>
//             <Text style={{ color: COLORS.textLight, fontSize: 13 }}>Add your first project!</Text>
//           </View>
//         )}
//         {projects.map((item: any) => (
//           <View key={item._id || item.id} style={styles.jobCard}>
//             <Image source={{ uri: item.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" }} style={styles.jobCardImage} />
//             <View style={styles.jobCardContent}>
//               <Text style={styles.jobCardTitle}>{item.title}</Text>
//               <Text style={styles.jobCardCompany}>{item.type}</Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// function PostNewProjectScreen() {
//   const navigation = useNavigation<any>();
//   const { ax } = useUser();
//   const toast = useToast();
//   const [title, setTitle] = useState("");
//   const [type,  setType]  = useState("Research");
//   const [desc,  setDesc]  = useState("");
//   const [ld, setLd] = useState(false);

//   const go = async () => {
//     if (!title) { toast("Title required", "error"); return; }
//     setLd(true);
//     try {
//       await ax().post(API_PROJ, { title, type, description: desc, image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80" });
//       toast("Project added!", "success"); navigation.goBack();
//     } catch (e: any) { toast(e?.response?.data?.message || "Error adding project", "error"); }
//     finally { setLd(false); }
//   };

//   return (
//     <ScrollView style={styles.screenContainer}>
//       <Header title="New Project" back={true} />
//       <View style={styles.formContainer}>
//         <Text style={styles.formLabel}>Project Title *</Text>
//         <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. AI in Healthcare" placeholderTextColor={COLORS.textLight} />

//         <Text style={styles.formLabel}>Project Type</Text>
//         <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
//           {["Research", "Development", "Collaboration", "Internship"].map(t => (
//             <TouchableOpacity key={t} onPress={() => setType(t)}
//               style={[styles.durationBtn, type === t && styles.durationBtnActive]}>
//               <Text style={type === t ? styles.durationTextActive : styles.durationText}>{t}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text style={styles.formLabel}>Description</Text>
//         <TextInput style={[styles.input, styles.textArea]} value={desc} onChangeText={setDesc}
//           placeholder="Project details..." placeholderTextColor={COLORS.textLight} multiline />

//         <TouchableOpacity style={[styles.primaryButton, ld && { opacity: 0.7 }]} onPress={go} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Save Project</Text>}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  CUSTOM DRAWER
// // ═══════════════════════════════════════════════════════════════
// function CustomDrawer(props: any) {
//   const { user } = useUser();
//   const navigation = useNavigation<any>();

//   return (
//     <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: COLORS.white, flex: 1 }}>
//       <View style={styles.drawerHeader}>
//         <View style={{ marginBottom: 14 }}>
//           <CXLogo size={22} inv />
//         </View>
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <View style={styles.drawerAvatarWrap}>
//             {user?.logo
//               ? <Image source={{ uri: user.logo }} style={styles.drawerAvatarImg} />
//               : <Text style={{ fontSize: 24, fontWeight: "900", color: "#fff" }}>{(user?.name || "C").charAt(0)}</Text>}
//           </View>
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.drawerName} numberOfLines={1}>{user?.name || "Partner"}</Text>
//             <Text style={styles.drawerEmail}>{user?.industry || "Industry Partner"}</Text>
//           </View>
//         </View>
//       </View>

//       <View style={{ flex: 1, paddingTop: 10 }}>
//         <DrawerItemList {...props}
//           activeBackgroundColor={COLORS.accent}
//           activeTintColor={COLORS.primary}
//           inactiveTintColor={COLORS.textLight}
//           itemStyle={{ borderRadius: 8, marginHorizontal: 8 }} />
//       </View>

//       {/* No logout — no auth */}
//     </DrawerContentScrollView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  NAVIGATION  (No auth stack — directly opens MainApp)
// // ═══════════════════════════════════════════════════════════════
// const Drawer = createDrawerNavigator();
// const Stack  = createNativeStackNavigator();

// const MainApp = () => (
//   <Drawer.Navigator
//     drawerContent={props => <CustomDrawer {...props} />}
//     screenOptions={{
//       headerShown: false,
//       drawerActiveTintColor: COLORS.primary,
//       drawerLabelStyle: { fontSize: 15, marginLeft: -3 },
//       drawerStyle: { width: width * 0.78 },
//     }}>
//     <Drawer.Screen name="Dashboard"         component={HomeScreen}            options={{ drawerIcon: ({ color }) => <Ionicons name="grid-outline"           size={22} color={color} /> }} />
//     <Drawer.Screen name="InternshipsMain"   component={InternshipsMainScreen} options={{ title: "Internships",  drawerIcon: ({ color }) => <Ionicons name="briefcase-outline"      size={22} color={color} /> }} />
//     <Drawer.Screen name="ManageProjects"    component={ManageProjects}        options={{ title: "Projects",     drawerIcon: ({ color }) => <Ionicons name="flask-outline"          size={22} color={color} /> }} />
//     <Drawer.Screen name="MoUs"              component={MoUScreen}             options={{ title: "MoUs",         drawerIcon: ({ color }) => <Ionicons name="document-text-outline" size={22} color={color} /> }} />
//     <Drawer.Screen name="MessagesMain"      component={MessagesScreen}        options={{ title: "Messages",     drawerIcon: ({ color }) => <Ionicons name="chatbubbles-outline"    size={22} color={color} /> }} />
//     <Drawer.Screen name="Profile"           component={ProfileScreen}         options={{ drawerIcon: ({ color }) => <Ionicons name="person-outline"          size={22} color={color} /> }} />
//     <Drawer.Screen name="AIChatbot"         component={AIChatbotScreen}       options={{ title: "CXbot",        drawerIcon: ({ color }) => <Ionicons name="sparkles-outline"       size={22} color={color} /> }} />
//     {/* Hidden screens */}
//     <Drawer.Screen name="CreateMoU"         component={CreateMoUScreen}       options={{ drawerItemStyle: { display: "none" } }} />
//     <Drawer.Screen name="PostNewInternship" component={PostNewInternshipScreen} options={{ drawerItemStyle: { display: "none" } }} />
//     <Drawer.Screen name="PostNewProject"    component={PostNewProjectScreen}  options={{ drawerItemStyle: { display: "none" } }} />
//     <Drawer.Screen name="ChatScreen"        component={ChatScreen}            options={{ drawerItemStyle: { display: "none" } }} />
//   </Drawer.Navigator>
// );

// function RootStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="MainApp"   component={MainApp} />
//       <Stack.Screen name="MouDetail" component={MouDetailScreen} />
//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <UserProvider>
//       <ToastProvider>
//         <RootStack />
//       </ToastProvider>
//     </UserProvider>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  STYLES
// // ═══════════════════════════════════════════════════════════════
// const styles = StyleSheet.create({
//   screenContainer: { flex: 1, backgroundColor: COLORS.background },
//   scrollContent:   { padding: 20, paddingBottom: 50 },

//   toast:    { position: "absolute", top: Platform.OS === "ios" ? 54 : 44, left: 14, right: 14, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, borderWidth: 1, elevation: 10, zIndex: 9999 },
//   toastTxt: { fontSize: 13, fontWeight: "600", flex: 1 },

//   header:          { backgroundColor: COLORS.white, paddingTop: Platform.OS === "ios" ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", elevation: 2 },
//   headerTitle:     { fontSize: 18, fontWeight: "700", color: COLORS.primary },
//   greetingText:    { fontSize: 12, color: COLORS.textLight },
//   headerAvatarWrap:{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: COLORS.border },
//   headerAvatarImg: { width: 40, height: 40, borderRadius: 20 },
//   headerAvatarTxt: { fontSize: 16, fontWeight: "900", color: "#fff" },
//   headerBtn:       { padding: 4 },
//   aiFab:           { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", elevation: 5 },

//   statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
//   statusText:  { fontSize: 10, fontWeight: "700" },

//   statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
//   statCard:       { flex: 1, backgroundColor: COLORS.white, padding: 16, borderRadius: 12, marginHorizontal: 5, alignItems: "center", elevation: 2 },
//   statNumber:     { fontSize: 24, fontWeight: "800", color: COLORS.primary },
//   statLabel:      { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
//   sectionHeader:  { fontSize: 18, fontWeight: "700", color: COLORS.primary, marginBottom: 16, marginLeft: 4 },
//   actionGrid:     { flexDirection: "row", flexWrap: "wrap", gap: 12 },
//   actionCard:     { flex: 1, minWidth: "30%", backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: "center", elevation: 2, marginBottom: 10 },
//   actionIcon:     { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginBottom: 12 },
//   actionTitle:    { fontSize: 13, fontWeight: "600", color: COLORS.text, textAlign: "center" },

//   formContainer: { padding: 20 },
//   formLabel:     { fontSize: 14, fontWeight: "600", color: COLORS.primary, marginBottom: 8, marginTop: 16 },
//   input:         { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, color: COLORS.text },
//   textArea:      { textAlignVertical: "top", height: 100 },
//   primaryButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: "center", marginTop: 32, flexDirection: "row", justifyContent: "center" },
//   primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
//   createButton:  { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary, padding: 14, borderRadius: 12, marginBottom: 16 },
//   createButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8, fontSize: 16 },

//   bannerUpload:   { width: "100%", height: 180, backgroundColor: "#E5E7EB", borderRadius: 16, marginBottom: 20, overflow: "hidden", borderWidth: 1, borderColor: "#D1D5DB", borderStyle: "dashed", justifyContent: "center", alignItems: "center" },
//   uploadPlaceholder:{ alignItems: "center" },
//   uploadText:     { marginTop: 8, color: COLORS.textLight, fontWeight: "500" },
//   uploadedBanner: { width: "100%", height: "100%" },

//   durationBtn:       { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
//   durationBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   durationText:      { fontSize: 12, color: COLORS.text },
//   durationTextActive:{ color: COLORS.white, fontWeight: "600" },

//   jobCard:       { backgroundColor: COLORS.white, borderRadius: 16, marginBottom: 16, overflow: "hidden", elevation: 2 },
//   jobCardImage:  { width: "100%", height: 120 },
//   jobCardContent:{ padding: 16 },
//   jobCardTitle:  { fontSize: 16, fontWeight: "bold", color: COLORS.text },
//   jobCardCompany:{ fontSize: 13, color: COLORS.textLight, marginBottom: 8 },
//   activeTag:     { backgroundColor: "#DEF7EC", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
//   activeTagText: { color: COLORS.success, fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
//   jobFooter:     { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderColor: "#F3F4F6", paddingTop: 12, marginTop: 12 },
//   jobDate:       { fontSize: 12, color: "#9CA3AF" },
//   jobApps:       { fontSize: 12, fontWeight: "600", color: COLORS.primary },

//   mouCard:   { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 },
//   mouHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
//   mouUni:    { fontSize: 16, fontWeight: "bold", color: COLORS.primary, flex: 1 },
//   mouDept:   { fontSize: 13, color: COLORS.secondary, fontWeight: "600", marginTop: 2 },
//   mouType:   { fontSize: 14, color: COLORS.textLight },
//   mouFooter: { marginTop: 10, borderTopWidth: 1, borderColor: "#eee", paddingTop: 10 },
//   dateLabel: { fontSize: 12, color: "#666" },

//   profileHeaderCard: { backgroundColor: COLORS.white, padding: 20, alignItems: "center", borderBottomWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
//   imageWrapper:      { position: "relative", marginBottom: 15 },
//   profileBigImage:   { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: COLORS.accent },
//   cameraBtn:         { position: "absolute", bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff" },
//   profileName:       { fontSize: 22, fontWeight: "bold", color: COLORS.primary },

//   chatListItem: { flexDirection: "row", padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: "#f0f0f0" },
//   chatAvatar:   { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
//   chatContent:  { flex: 1, justifyContent: "center" },
//   chatRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   chatName:     { fontSize: 16, fontWeight: "bold", color: COLORS.primary },
//   chatTime:     { fontSize: 12, color: COLORS.textLight },
//   chatSubtitle: { fontSize: 12, color: COLORS.secondary, marginBottom: 2 },
//   chatMsg:      { fontSize: 14, color: COLORS.textLight, flex: 1 },
//   unreadBadge:  { backgroundColor: COLORS.primary, width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center", marginLeft: 8 },
//   unreadText:   { color: "white", fontSize: 10, fontWeight: "bold" },
//   chatHeader:   { flexDirection: "row", alignItems: "center", padding: 16, paddingTop: Platform.OS === "ios" ? 52 : 40, backgroundColor: COLORS.white, elevation: 2 },
//   chatHeaderAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 12 },
//   chatHeaderName:   { fontSize: 16, fontWeight: "bold", color: COLORS.primary },
//   chatHeaderStatus: { fontSize: 12, color: COLORS.success },
//   msgBubble:    { padding: 12, borderRadius: 16, maxWidth: "80%", marginBottom: 10 },
//   msgMe:        { alignSelf: "flex-end", backgroundColor: COLORS.primary, borderBottomRightRadius: 2 },
//   msgThem:      { alignSelf: "flex-start", backgroundColor: "#e5e5e5", borderBottomLeftRadius: 2 },
//   msgTextMe:    { color: "white" },
//   msgTextThem:  { color: COLORS.text },
//   msgTime:      { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
//   inputArea:    { flexDirection: "row", padding: 10, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: "#eee", alignItems: "center" },
//   chatInput:    { flex: 1, backgroundColor: "#f0f0f0", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
//   sendBtn:      { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" },

//   aiBubble:  { padding: 14, borderRadius: 16, maxWidth: "85%", marginBottom: 12 },
//   aiBot:     { alignSelf: "flex-start", backgroundColor: COLORS.botBubble, borderTopLeftRadius: 2 },
//   aiUser:    { alignSelf: "flex-end", backgroundColor: COLORS.userBubble, borderTopRightRadius: 2 },
//   aiIcon:    { marginBottom: 6, backgroundColor: COLORS.primary, width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center" },
//   aiBotText: { color: COLORS.text },
//   aiUserText:{ color: COLORS.white },

//   drawerHeader:    { padding: 20, paddingTop: Platform.OS === "ios" ? 60 : 48, paddingBottom: 20, backgroundColor: COLORS.primary, borderBottomWidth: 1, borderBottomColor: COLORS.border },
//   drawerAvatarWrap:{ width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.secondary, justifyContent: "center", alignItems: "center", overflow: "hidden", borderWidth: 2, borderColor: "rgba(255,255,255,0.25)" },
//   drawerAvatarImg: { width: 64, height: 64, borderRadius: 32 },
//   drawerName:      { fontSize: 16, fontWeight: "800", color: "#fff" },
//   drawerEmail:     { fontSize: 12, color: "rgba(255,255,255,0.6)" },

//   tabBtn:      { flex: 1, paddingVertical: 13, alignItems: "center" },
//   tabBtnActive:{ borderBottomWidth: 2.5, borderBottomColor: COLORS.primary },
//   tabTxt:      { fontSize: 13, color: COLORS.textLight, fontWeight: "600" },
//   tabTxtActive:{ color: COLORS.primary, fontWeight: "700" },

//   confCard: { backgroundColor: "#f0fdf4", borderWidth: 1.5, borderColor: "#86efac", borderRadius: 14, padding: 16, marginBottom: 14 },
//   ccell:    { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#bbf7d0" },
//   ccLbl:    { fontSize: 9, color: "#6b7280", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
//   ccVal:    { fontSize: 14, fontWeight: "800", color: "#15803d" },
//   pendCard: { backgroundColor: "#fffbeb", borderWidth: 1.5, borderColor: "#fde68a", borderRadius: 14, padding: 16, marginBottom: 14 },
//   selBtn:   { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#16a34a", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
//   outlineBtn:   { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, alignSelf: "flex-start", marginTop: 10 },
//   outlineBtnTxt:{ color: COLORS.primary, fontSize: 12, fontWeight: "700" },
//   tlDot:    { width: 22, height: 22, borderRadius: 11, justifyContent: "center", alignItems: "center", flexShrink: 0 },
//   logEntry: { borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1 },

//   overlay:  { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
//   sheet:    { backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "93%", paddingBottom: Platform.OS === "ios" ? 34 : 16 },
//   shHandle: { width: 36, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 4 },
//   shHead:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderColor: COLORS.border },
//   shTitle:  { fontSize: 16, fontWeight: "700", color: COLORS.primary, flex: 1 },
//   shFoot:   { flexDirection: "row", gap: 10, padding: 16, borderTopWidth: 1, borderColor: COLORS.border },
//   rtBtn:    { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, flex: 1, minWidth: "42%" },
// });


/**
 * CollaXion Industry App — Updated
 * - New premium dashboard design
 * - Fully updated MOU module (create, respond, meeting slots)
 * - Profile image reflects on dashboard
 * - Professional drawer
 * - Backend: /api/industry/* routes
 */






























// import { Ionicons } from "@expo/vector-icons";
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
// } from "@react-navigation/drawer";
// import { useNavigation } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import * as ImagePicker from "expo-image-picker";
// import React, {
//   createContext, useCallback, useContext,
//   useEffect, useRef, useState
// } from "react";
// // ✅ SAHI — sirf ye imports rakho react-native se
// import {
//   ActivityIndicator, Alert, Animated, Dimensions,
//   FlatList, Image, KeyboardAvoidingView,
//   Modal, Platform, RefreshControl, ScrollView,
//   StatusBar, StyleSheet, Text, TextInput,
//   TouchableOpacity, View
// } from "react-native";
// import axios from "axios";

// const { width, height } = Dimensions.get("window");

// // ─── THEME ──────────────────────────────────────────────────────
// const C = {
//   navy:       "#0F2236",
//   navyDark:   "#08151F",
//   navyMid:    "#193648",
//   teal:       "#0D7377",
//   tealLight:  "#14BDBD",
//   gold:       "#C9A84C",
//   goldLight:  "#F0C96A",
//   offWhite:   "#F5F7FA",
//   white:      "#FFFFFF",
//   text:       "#1A2332",
//   textMid:    "#4A5568",
//   textLight:  "#8A96A3",
//   border:     "#E2EAF0",
//   success:    "#10B981",
//   danger:     "#EF4444",
//   warning:    "#F59E0B",
//   purple:     "#7C3AED",
//   card:       "#FFFFFF",
//   bg:         "#EEF3F8",
// };

// // ─── API ────────────────────────────────────────────────────────
// // const BASE     = "http://localhost:5000";
// // Localhost hata kar apna Mac ka IP likhein
// const BASE = "http://192.168.0.245:5000";
// const API_MOU  = `${BASE}/api/industry/mous`;
// const API_INT  = `${BASE}/api/industry/internships`;
// const API_PROJ = `${BASE}/api/industry/projects`;

// // ─── STATUS CONFIG ───────────────────────────────────────────────
// const SC: Record<string, { c: string; bg: string; lbl: string }> = {
//   Draft:                    { c: "#64748b", bg: "#f1f5f9",  lbl: "Draft" },
//   "Sent to Industry":       { c: "#d97706", bg: "#fffbeb",  lbl: "Sent to Us" },
//   "Changes Proposed":       { c: "#7c3aed", bg: "#f5f3ff",  lbl: "Changes Proposed" },
//   "Industry Responded":     { c: "#0891b2", bg: "#ecfeff",  lbl: "Responded" },
//   "Approved by Industry":   { c: "#059669", bg: "#ecfdf5",  lbl: "We Approved ✓" },
//   "Approved by University": { c: "#0284c7", bg: "#e0f2fe",  lbl: "Uni Approved" },
//   "Mutually Approved":      { c: "#16a34a", bg: "#dcfce7",  lbl: "Mutually Approved ✓" },
//   Rejected:                 { c: "#dc2626", bg: "#fef2f2",  lbl: "Rejected" },
// };

// const CT: Record<string, { c: string; bg: string; ic: string; lbl: string }> = {
//   industry_change:    { c: "#7c3aed", bg: "#f5f3ff", ic: "🏭", lbl: "Industry Changed" },
//   industry_approve:   { c: "#059669", bg: "#ecfdf5", ic: "✅", lbl: "Industry Approved" },
//   industry_reject:    { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Industry Rejected" },
//   industry_response:  { c: "#0891b2", bg: "#ecfeff", ic: "💬", lbl: "Industry Response" },
//   university_change:  { c: "#0284c7", bg: "#e0f2fe", ic: "🎓", lbl: "University Changed" },
//   university_approve: { c: "#16a34a", bg: "#dcfce7", ic: "✅", lbl: "Uni Approved" },
//   university_reject:  { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Uni Rejected" },
//   meeting_proposed:   { c: "#7c3aed", bg: "#f5f3ff", ic: "📅", lbl: "Meeting Proposed" },
//   meeting_confirmed:  { c: "#16a34a", bg: "#dcfce7", ic: "🤝", lbl: "Meeting Confirmed" },
// };

// // ─── HELPERS ─────────────────────────────────────────────────────
// const fmtDate = (d?: string | null) => {
//   if (!d) return "—";
//   try { return new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }); }
//   catch { return d; }
// };
// const fmtDT = (d?: string | null) => {
//   if (!d) return "—";
//   try { return new Date(d).toLocaleString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
//   catch { return d; }
// };
// const addCL = (m: any, type: string, data: any = {}) =>
//   [...(m.changeLog || []), { id: Date.now(), type, date: new Date().toISOString(), ...data }];

// const bldPayload = (m: any) => ({
//   title: m.title, university: m.university, industry: m.industry,
//   collaborationType: m.collaborationType, startDate: m.startDate, endDate: m.endDate,
//   description: m.description, objectives: m.objectives || [],
//   responsibilities: m.responsibilities, terms: m.terms || [],
//   signatories: m.signatories, universityContact: m.universityContact,
//   industryContact: m.industryContact, universityLogo: m.universityLogo || "",
//   industryLogo: m.industryLogo || "", status: m.status,
//   universityStamp: m.universityStamp, industryStamp: m.industryStamp,
//   sentAt: m.sentAt, industryResponseAt: m.industryResponseAt,
//   proposedChanges: m.proposedChanges || [], changeLog: m.changeLog || [],
//   scheduledMeeting: m.scheduledMeeting || null,
// });

// // ─── USER CONTEXT ────────────────────────────────────────────────
// const UserCtx = createContext<any>(null);
// const useUser = () => useContext(UserCtx);

// const DEFAULT_USER = {
//   _id: "industry_001",
//   name: "Edit Industry Name",
//   email: "hr@techsolutions.com",
//   industry: "Information Technology",
//   phone: "+",
//   website: "Edit Industry URL",
//   address: "",
//   about: "Edit About",
//   logo: "",
// };

// const UserProvider = ({ children }: any) => {
//   const [user, setUser] = useState<any>(DEFAULT_USER);
//   const ax = useCallback(() => axios.create({ timeout: 10000 }), []);
//   const updateUser = (data: any) => setUser((p: any) => ({ ...p, ...data }));
//   return <UserCtx.Provider value={{ user, updateUser, ax }}>{children}</UserCtx.Provider>;
// };

// // ─── TOAST ───────────────────────────────────────────────────────
// const ToastCtx = createContext<any>(null);
// const useToast = () => useContext(ToastCtx);

// const ToastProvider = ({ children }: any) => {
//   const [t, setT] = useState<any>(null);
//   const anim = useRef(new Animated.Value(0)).current;
//   const show = (msg: string, type = "info") => {
//     setT({ msg, type });
//     Animated.sequence([
//       Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
//       Animated.delay(2600),
//       Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
//     ]).start(() => setT(null));
//   };
//   const colors = { success: ["#d1fae5", "#059669"], error: ["#fee2e2", "#dc2626"], info: ["#dbeafe", "#2563eb"] };
//   const [bg, fg] = (colors as any)[t?.type || "info"] || colors.info;
//   return (
//     <ToastCtx.Provider value={show}>
//       {children}
//       {t && (
//         <Animated.View style={[styles.toast, { backgroundColor: bg, borderColor: fg + "66",
//           opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
//           <Ionicons name={t.type === "success" ? "checkmark-circle" : t.type === "error" ? "close-circle" : "information-circle"} size={18} color={fg} />
//           <Text style={[styles.toastTxt, { color: fg }]}>{t.msg}</Text>
//         </Animated.View>
//       )}
//     </ToastCtx.Provider>
//   );
// };

// // ─── STATUS BADGE ────────────────────────────────────────────────
// const SBadge = ({ status }: { status: string }) => {
//   const s = SC[status] || { c: C.textLight, bg: C.bg, lbl: status };
//   return (
//     <View style={[styles.badge, { backgroundColor: s.bg }]}>
//       <Text style={[styles.badgeTxt, { color: s.c }]}>{s.lbl}</Text>
//     </View>
//   );
// };

// // ─── HEADER ──────────────────────────────────────────────────────
// const Header = ({ title, back = false, right }: any) => {
//   const nav = useNavigation<any>();
//   return (
//     <View style={styles.hdr}>
//       <TouchableOpacity onPress={() => back ? nav.goBack() : nav.openDrawer()} style={styles.hdrBtn}>
//         <Ionicons name={back ? "arrow-back" : "menu-outline"} size={24} color={C.navy} />
//       </TouchableOpacity>
//       <Text style={styles.hdrTitle} numberOfLines={1}>{title}</Text>
//       {right ? right : <View style={{ width: 40 }} />}
//     </View>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// //  DASHBOARD
// // ═══════════════════════════════════════════════════════════════
// function DashboardScreen() {
//   const nav = useNavigation<any>();
//   const { user, ax } = useUser();
//   const [counts, setCounts] = useState({ mous: 0, internships: 0, projects: 0, pending: 0 });
//   const [recentMous, setRecentMous] = useState<any[]>([]);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
//     const a = ax();
//     Promise.all([
//       a.get(`${API_MOU}/mine`).catch(() => ({ data: [] })),
//       a.get(API_INT).catch(() => ({ data: [] })),
//       a.get(API_PROJ).catch(() => ({ data: [] })),
//     ]).then(([m, i, p]) => {
//       const mous = m.data || [];
//       const pending = mous.filter((x: any) => ["Sent to Industry", "Changes Proposed"].includes(x.status)).length;
//       setCounts({ mous: mous.length, internships: (i.data || []).length, projects: (p.data || []).length, pending });
//       setRecentMous(mous.slice(0, 3));
//     });
//   }, []);

//   const initials = (name: string) => name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "CX";

//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <StatusBar barStyle="light-content" backgroundColor={C.navy} />

//       {/* Top Banner */}
//       <View style={styles.dashBanner}>
//         <View style={styles.dashBannerContent}>
//           <TouchableOpacity onPress={() => nav.openDrawer()} style={styles.dashMenuBtn}>
//             <Ionicons name="menu" size={26} color={C.white} />
//           </TouchableOpacity>
//           <View style={{ flex: 1, marginLeft: 12 }}>
//             <Text style={styles.dashGreet}>Good day,</Text>
//             <Text style={styles.dashName} numberOfLines={1}>{user?.name || "Partner"}</Text>
//           </View>
//           <TouchableOpacity onPress={() => nav.navigate("Profile")} style={styles.dashAvatar}>
//             {user?.logo
//               ? <Image source={{ uri: user.logo }} style={styles.dashAvatarImg} />
//               : <Text style={styles.dashAvatarTxt}>{initials(user?.name || "CX")}</Text>}
//             <View style={styles.dashAvatarDot} />
//           </TouchableOpacity>
//         </View>

//         {/* Stats Row */}
//         <View style={styles.statsRow}>
//           {[
//             { n: counts.mous,         lbl: "MOUs",        icon: "document-text" },
//             { n: counts.internships,  lbl: "Internships", icon: "briefcase" },
//             { n: counts.projects,     lbl: "Projects",    icon: "flask" },
//             { n: counts.pending,      lbl: "Pending",     icon: "time", warn: true },
//           ].map((s, i) => (
//             <View key={i} style={styles.statPill}>
//               <Text style={[styles.statN, s.warn && counts.pending > 0 && { color: C.goldLight }]}>{s.n}</Text>
//               <Text style={styles.statLbl}>{s.lbl}</Text>
//             </View>
//           ))}
//         </View>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
//         <Animated.View style={{ opacity: fadeAnim }}>

//           {/* Pending Alert */}
//           {counts.pending > 0 && (
//             <TouchableOpacity onPress={() => nav.navigate("MoUs")} style={styles.alertBanner}>
//               <View style={styles.alertDot} />
//               <Text style={styles.alertTxt}>
//                 {counts.pending} MOU{counts.pending > 1 ? "s" : ""} awaiting your response
//               </Text>
//               <Ionicons name="chevron-forward" size={16} color={C.gold} />
//             </TouchableOpacity>
//           )}

//           {/* Quick Actions */}
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Quick Actions</Text>
//           </View>
//           <View style={styles.actionsGrid}>
//             {[
//               { icon: "document-text", label: "MOU\nManagement", screen: "MoUs", color: C.teal, bg: "#E0F7F7" },
//               { icon: "briefcase",     label: "Post\nInternship", screen: "InternshipsMain", color: "#7C3AED", bg: "#F3F0FF" },
//               { icon: "flask",         label: "Add\nProject",     screen: "ManageProjects", color: "#0284C7", bg: "#E0F2FE" },
//               { icon: "chatbubbles",   label: "Messages",         screen: "MessagesMain", color: "#D97706", bg: "#FEF3C7" },
//               { icon: "sparkles",      label: "CXbot\nAI",        screen: "AIChatbot", color: C.navy, bg: C.border },
//               { icon: "person",        label: "Profile",          screen: "Profile", color: "#059669", bg: "#D1FAE5" },
//             ].map((a, i) => (
//               <TouchableOpacity key={i} style={styles.actionTile} onPress={() => nav.navigate(a.screen)} activeOpacity={0.82}>
//                 <View style={[styles.actionTileIcon, { backgroundColor: a.bg }]}>
//                   <Ionicons name={a.icon as any} size={26} color={a.color} />
//                 </View>
//                 <Text style={styles.actionTileLbl}>{a.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Recent MOUs */}
//           {recentMous.length > 0 && (
//             <>
//               <View style={[styles.sectionHeader, { marginTop: 8 }]}>
//                 <Text style={styles.sectionTitle}>Recent MOUs</Text>
//                 <TouchableOpacity onPress={() => nav.navigate("MoUs")}>
//                   <Text style={styles.seeAll}>See all</Text>
//                 </TouchableOpacity>
//               </View>
//               {recentMous.map((m: any) => (
//                 <TouchableOpacity key={m._id} style={styles.recentMouCard}
//                   onPress={() => nav.navigate("MouDetail", { mouId: m._id })} activeOpacity={0.85}>
//                   <View style={styles.recentMouLeft}>
//                     <Text style={styles.recentMouTitle} numberOfLines={1}>{m.title || m.university}</Text>
//                     <Text style={styles.recentMouSub} numberOfLines={1}>{m.collaborationType}</Text>
//                     <Text style={styles.recentMouDate}>{fmtDate(m.endDate)}</Text>
//                   </View>
//                   <SBadge status={m.status} />
//                 </TouchableOpacity>
//               ))}
//             </>
//           )}

//           {/* Company Card */}
//           <View style={styles.companyCard}>
//             <View style={styles.companyCardLeft}>
//               <View style={styles.companyLogoBox}>
//                 {user?.logo
//                   ? <Image source={{ uri: user.logo }} style={styles.companyLogoImg} />
//                   : <Text style={styles.companyLogoTxt}>{initials(user?.name || "CX")}</Text>}
//               </View>
//               <View>
//                 <Text style={styles.companyCardName}>{user?.name}</Text>
//                 <Text style={styles.companyCardSub}>{user?.industry}</Text>
//                 {user?.address && <Text style={styles.companyCardAddr}>📍 {user.address}</Text>}
//               </View>
//             </View>
//             <TouchableOpacity onPress={() => nav.navigate("Profile")} style={styles.editProfileBtn}>
//               <Ionicons name="pencil" size={14} color={C.teal} />
//               <Text style={styles.editProfileTxt}>Edit</Text>
//             </TouchableOpacity>
//           </View>

//         </Animated.View>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  PROFILE SCREEN — image updates dashboard
// // ═══════════════════════════════════════════════════════════════
// function ProfileScreen() {
//   const nav = useNavigation<any>();
//   const { user, updateUser, ax } = useUser();
//   const toast = useToast();
//   const [ld, setLd] = useState(false);
//   const [form, setForm] = useState({ ...user });

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") { Alert.alert("Permission needed", "Camera roll access required."); return; }
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true, aspect: [1, 1], quality: 0.8,
//     });
//     if (!res.canceled) {
//       const newLogo = res.assets[0].uri;
//       setForm((f: any) => ({ ...f, logo: newLogo }));
//       // Immediately reflect in context/dashboard
//       updateUser({ logo: newLogo });
//     }
//   };

//   const save = async () => {
//     setLd(true);
//     try {
//       try { await ax().put(`${BASE}/api/industry/auth/profile`, form); } catch {}
//       updateUser(form);
//       toast("Profile updated!", "success");
//     } catch { toast("Update failed", "error"); }
//     finally { setLd(false); }
//   };

//   const initials = (n: string) => n?.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "CX";

//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="Company Profile" back />
//       <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
//         {/* Profile Header */}
//         <View style={styles.profBanner}>
//           <TouchableOpacity onPress={pickImage} style={styles.profAvatarWrap}>
//             {form.logo
//               ? <Image source={{ uri: form.logo }} style={styles.profAvatarImg} />
//               : <Text style={styles.profAvatarTxt}>{initials(form.name)}</Text>}
//             <View style={styles.profCamBtn}>
//               <Ionicons name="camera" size={14} color="#fff" />
//             </View>
//           </TouchableOpacity>
//           <Text style={styles.profName}>{form.name}</Text>
//           <View style={styles.verifiedBadge}>
//             <Ionicons name="shield-checkmark" size={12} color={C.teal} />
//             <Text style={styles.verifiedTxt}>Verified Partner</Text>
//           </View>
//         </View>

//         <View style={styles.profForm}>
//           <Text style={styles.profSection}>Company Info</Text>
//           {[
//             { lbl: "Company Name", key: "name" },
//             { lbl: "Industry Sector", key: "industry" },
//             { lbl: "Website", key: "website", kbType: "url" },
//             { lbl: "Address", key: "address" },
//           ].map(f => (
//             <View key={f.key} style={styles.fieldWrap}>
//               <Text style={styles.fieldLbl}>{f.lbl}</Text>
//               <TextInput style={styles.fieldInput} value={(form as any)[f.key]}
//                 onChangeText={(v: string) => setForm((x: any) => ({ ...x, [f.key]: v }))}
//                 keyboardType={(f as any).kbType || "default"} />
//             </View>
//           ))}
//           <View style={styles.fieldWrap}>
//             <Text style={styles.fieldLbl}>About Us</Text>
//             <TextInput style={[styles.fieldInput, { height: 90, textAlignVertical: "top" }]}
//               value={form.about} onChangeText={(v: string) => setForm((x: any) => ({ ...x, about: v }))} multiline />
//           </View>

//           <Text style={[styles.profSection, { marginTop: 20 }]}>Contact</Text>
//           {[
//             { lbl: "Email", key: "email", kbType: "email-address" },
//             { lbl: "Phone", key: "phone", kbType: "phone-pad" },
//           ].map(f => (
//             <View key={f.key} style={styles.fieldWrap}>
//               <Text style={styles.fieldLbl}>{f.lbl}</Text>
//               <TextInput style={styles.fieldInput} value={(form as any)[f.key]}
//                 onChangeText={(v: string) => setForm((x: any) => ({ ...x, [f.key]: v }))}
//                 keyboardType={(f as any).kbType || "default"} autoCapitalize="none" />
//             </View>
//           ))}

//           <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={ld}>
//             {ld ? <ActivityIndicator color="#fff" /> : (
//               <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//                 <Ionicons name="checkmark-circle" size={18} color="#fff" />
//                 <Text style={styles.saveBtnTxt}>Save Changes</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MOU LIST
// // ═══════════════════════════════════════════════════════════════
// function MoUScreen() {
//   const nav = useNavigation<any>();
//   const { ax } = useUser();
//   const [mous, setMous] = useState<any[]>([]);
//   const [ld, setLd] = useState(true);
//   const [ref, setRef] = useState(false);
//   const [filter, setFilter] = useState("All");

//   const load = useCallback(async (show = true) => {
//     if (show) setLd(true);
//     try { const r = await ax().get(`${API_MOU}/mine`); setMous(r.data || []); }
//     catch {} finally { setLd(false); setRef(false); }
//   }, [ax]);

//   useEffect(() => { load(); }, []);

//   const filtered = filter === "All" ? mous :
//     mous.filter(m => filter === "Pending" ? ["Sent to Industry", "Changes Proposed"].includes(m.status) :
//       filter === "Approved" ? m.status === "Mutually Approved" : m.status === filter);

//   const tabs = ["All", "Pending", "Approved", "Rejected"];

//   if (ld) return <View style={styles.center}><ActivityIndicator color={C.teal} size="large" /></View>;

//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="MOU Management"
//         right={
//           <TouchableOpacity onPress={() => nav.navigate("CreateMoU")} style={styles.hdrAction}>
//             <Ionicons name="add" size={22} color={C.white} />
//           </TouchableOpacity>
//         }
//         back
//       />

//       {/* Filter Tabs */}
//       <View style={styles.filterRow}>
//         {tabs.map(t => (
//           <TouchableOpacity key={t} onPress={() => setFilter(t)}
//             style={[styles.filterTab, filter === t && styles.filterTabActive]}>
//             <Text style={[styles.filterTabTxt, filter === t && styles.filterTabTxtActive]}>{t}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <FlatList
//         data={filtered}
//         keyExtractor={m => m._id}
//         contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
//         refreshControl={<RefreshControl refreshing={ref} onRefresh={() => { setRef(true); load(false); }} tintColor={C.teal} />}
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Ionicons name="document-text-outline" size={56} color={C.textLight} />
//             <Text style={styles.emptyTitle}>No MOUs yet</Text>
//             <Text style={styles.emptySub}>Tap + to request a new MOU</Text>
//           </View>
//         }
//         renderItem={({ item: m }) => {
//           const needsAction = ["Sent to Industry", "Changes Proposed"].includes(m.status);
//           return (
//             <TouchableOpacity
//               style={[styles.mouListCard, needsAction && styles.mouListCardUrgent]}
//               onPress={() => nav.navigate("MouDetail", { mouId: m._id })}
//               activeOpacity={0.85}>
//               {needsAction && (
//                 <View style={styles.urgentBanner}>
//                   <Ionicons name="flash" size={11} color={C.gold} />
//                   <Text style={styles.urgentTxt}>Action Required</Text>
//                 </View>
//               )}
//               {m.status === "Mutually Approved" && (
//                 <View style={[styles.urgentBanner, { backgroundColor: "#dcfce7" }]}>
//                   <Ionicons name="checkmark-circle" size={11} color="#16a34a" />
//                   <Text style={[styles.urgentTxt, { color: "#16a34a" }]}>Mutually Approved</Text>
//                 </View>
//               )}
//               <View style={styles.mouListHead}>
//                 <View style={{ flex: 1, marginRight: 10 }}>
//                   <Text style={styles.mouListTitle} numberOfLines={1}>{m.title || m.university}</Text>
//                   <Text style={styles.mouListSub}>{m.university} · {m.collaborationType}</Text>
//                 </View>
//                 <SBadge status={m.status} />
//               </View>
//               <View style={styles.mouListFooter}>
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
//                   <Ionicons name="calendar-outline" size={12} color={C.textLight} />
//                   <Text style={styles.mouListDate}>{fmtDate(m.startDate)} → {fmtDate(m.endDate)}</Text>
//                 </View>
//                 {(m.scheduledMeeting?.confirmedSlot?.date || m.meetingConfirmedSlot?.date) && (
//                   <View style={styles.mtgConfirmedChip}>
//                     <Ionicons name="checkmark-circle" size={10} color="#16a34a" />
//                     <Text style={styles.mtgConfirmedTxt}>Meeting set</Text>
//                   </View>
//                 )}
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//       />
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  CREATE MOU
// // ═══════════════════════════════════════════════════════════════
// function CreateMoUScreen() {
//   const nav = useNavigation<any>();
//   const { user, ax } = useUser();
//   const toast = useToast();
//   const [ld, setLd] = useState(false);
//   const [step, setStep] = useState(1);
//   const [form, setForm] = useState({
//     title: "", collaborationType: "", description: "",
//     objectives: [""], terms: [""],
//     startDate: "", endDate: "",
//     signatories: { industry: "" },
//     industryContact: { name: "", designation: "", email: "" },
//   });

//   const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
//   const arrAdd = (k: string) => setForm((f: any) => ({ ...f, [k]: [...f[k], ""] }));
//   const arrUpd = (k: string, i: number, v: string) => setForm((f: any) => { const a = [...f[k]]; a[i] = v; return { ...f, [k]: a }; });

//   // const submit = async () => {
//   //   if (!form.title || !form.collaborationType) { Alert.alert("Missing", "Title & collaboration type required."); return; }
//   //   setLd(true);
//   //   try {
//   //     const cl = addCL({ changeLog: [] }, "university_change", { party: "Industry", message: `MOU "${form.title}" requested` });
//   //     await ax().post(API_MOU, {
//   //       ...form,
//   //       university: "Riphah International University",
//   //       industry: user?.name || "", industryId: user?._id,
//   //       industryLogo: user?.logo || "", status: "Draft", changeLog: cl,
//   //       startDate: form.startDate || new Date().toISOString().split("T")[0],
//   //       endDate: form.endDate || new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
//   //     });
//   //     toast("MOU request sent!", "success");
//   //     nav.goBack();
//   //   } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//   //   finally { setLd(false); }
//   // };



//   const submit = async () => {
//   // 1. Check karein ke zaroori fields bhari hui hain
//   if (!form.title || !form.collaborationType) {
//     Alert.alert("Missing Information", "Please enter Title and Collaboration Type.");
//     return;
//   }

//   setLd(true);
//   try {
//     // 2. Ye hai wo sara data jo Backend mang raha hai
//     const payload = {
//       title: form.title,
//       university: "Riphah International University", // University ka naam
//       industry: user?.name || "New Industry Partner", // Industry ka naam (user context se)
//       industryId: user?._id || "ind_123",
//       collaborationType: form.collaborationType,
//       description: form.description || "",
//       startDate: form.startDate || new Date().toISOString().split('T')[0], // Agar khali ho to aaj ki date
//       endDate: form.endDate || new Date(Date.now() + 31536000000).toISOString().split('T')[0], // 1 saal baad ki date
//       objectives: form.objectives.filter(Boolean),
//       terms: form.terms.filter(Boolean),
//       industryContact: form.industryContact,
//       signatories: form.signatories,
//       status: "Draft",
//       changeLog: [{
//         id: Date.now(),
//         type: "industry_change",
//         date: new Date().toISOString(),
//         party: "Industry",
//         message: `MOU Request created by ${user?.name}`
//       }]
//     };

//     // 3. API Call
//     const response = await ax().post(API_MOU, payload);
    
//     if (response.status === 201 || response.status === 200) {
//       toast("MOU request sent successfully!", "success");
//       nav.goBack();
//     }
//   } catch (e) {
//     console.log("Full Error Object:", e.response?.data); // Mac ke terminal mein error dikhega
//     const errorMsg = e.response?.data?.message || "Server connection failed";
//     Alert.alert("Creation Failed", errorMsg);
//   } finally {
//     setLd(false);
//   }
// };

//   const TYPES = ["Research", "Internship", "Training", "Consultancy", "Joint Venture", "Other"];

//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="Request New MOU" back />

//       {/* Step Indicator */}
//       <View style={styles.stepRow}>
//         {[1, 2, 3].map(s => (
//           <View key={s} style={styles.stepItem}>
//             <View style={[styles.stepDot, step >= s && styles.stepDotActive]}>
//               {step > s ? <Ionicons name="checkmark" size={12} color="#fff" /> :
//                 <Text style={[styles.stepNum, step >= s && { color: "#fff" }]}>{s}</Text>}
//             </View>
//             <Text style={[styles.stepLbl, step >= s && { color: C.teal }]}>
//               {s === 1 ? "Basics" : s === 2 ? "Details" : "Review"}
//             </Text>
//             {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
//           </View>
//         ))}
//       </View>

//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.createForm}>

//           {step === 1 && (
//             <>
//               <Text style={styles.stepHeading}>Basic Information</Text>
//               <FieldInput label="MOU Title *" value={form.title} onChange={v => set("title", v)} placeholder="e.g. AI Research Collaboration" />
//               <FieldInput label="University" value="Riphah International University" onChange={() => {}} editable={false} />

//               <Text style={styles.fieldLbl}>Collaboration Type *</Text>
//               <View style={styles.typeGrid}>
//                 {TYPES.map(t => (
//                   <TouchableOpacity key={t} onPress={() => set("collaborationType", t)}
//                     style={[styles.typeChip, form.collaborationType === t && styles.typeChipActive]}>
//                     <Text style={[styles.typeChipTxt, form.collaborationType === t && styles.typeChipTxtActive]}>{t}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <FieldInput label="Start Date" value={form.startDate} onChange={v => set("startDate", v)} placeholder="YYYY-MM-DD" />
//               <FieldInput label="End Date" value={form.endDate} onChange={v => set("endDate", v)} placeholder="YYYY-MM-DD" />
//             </>
//           )}

//           {step === 2 && (
//             <>
//               <Text style={styles.stepHeading}>Purpose & Objectives</Text>
//               <FieldInput label="Description / Purpose *" value={form.description} onChange={v => set("description", v)}
//                 placeholder="Describe the purpose and scope..." multiline />

//               <Text style={styles.fieldLbl}>Objectives</Text>
//               {form.objectives.map((o: string, i: number) => (
//                 <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
//                   <View style={styles.objNum}><Text style={styles.objNumTxt}>{i + 1}</Text></View>
//                   <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} value={o}
//                     onChangeText={(v: string) => arrUpd("objectives", i, v)} placeholder={`Objective ${i + 1}`} />
//                 </View>
//               ))}
//               <TouchableOpacity onPress={() => arrAdd("objectives")} style={styles.addRowBtn}>
//                 <Ionicons name="add-circle-outline" size={16} color={C.teal} />
//                 <Text style={styles.addRowTxt}>Add Objective</Text>
//               </TouchableOpacity>

//               <Text style={[styles.fieldLbl, { marginTop: 16 }]}>Terms & Conditions</Text>
//               {form.terms.map((t: string, i: number) => (
//                 <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
//                   <View style={styles.objNum}><Text style={styles.objNumTxt}>{i + 1}</Text></View>
//                   <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} value={t}
//                     onChangeText={(v: string) => arrUpd("terms", i, v)} placeholder={`Term ${i + 1}`} />
//                 </View>
//               ))}
//               <TouchableOpacity onPress={() => arrAdd("terms")} style={styles.addRowBtn}>
//                 <Ionicons name="add-circle-outline" size={16} color={C.teal} />
//                 <Text style={styles.addRowTxt}>Add Term</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {step === 3 && (
//             <>
//               <Text style={styles.stepHeading}>Contact & Review</Text>
//               <FieldInput label="Your Contact Name" value={form.industryContact.name}
//                 onChange={v => set("industryContact", { ...form.industryContact, name: v })} />
//               <FieldInput label="Designation" value={form.industryContact.designation}
//                 onChange={v => set("industryContact", { ...form.industryContact, designation: v })} />
//               <FieldInput label="Contact Email" value={form.industryContact.email}
//                 onChange={v => set("industryContact", { ...form.industryContact, email: v })} kbType="email-address" />
//               <FieldInput label="Authorized Signatory" value={form.signatories.industry}
//                 onChange={v => set("signatories", { ...form.signatories, industry: v })} placeholder="Name & Designation" />

//               {/* Summary */}
//               <View style={styles.reviewCard}>
//                 <Text style={styles.reviewTitle}>Summary</Text>
//                 {[
//                   { l: "Title",      v: form.title },
//                   { l: "Type",       v: form.collaborationType },
//                   { l: "Duration",   v: `${form.startDate || "—"} → ${form.endDate || "—"}` },
//                   { l: "University", v: "Riphah International University" },
//                   { l: "Industry",   v: user?.name },
//                 ].map(r => (
//                   <View key={r.l} style={styles.reviewRow}>
//                     <Text style={styles.reviewLbl}>{r.l}</Text>
//                     <Text style={styles.reviewVal}>{r.v || "—"}</Text>
//                   </View>
//                 ))}
//               </View>
//             </>
//           )}

//           <View style={styles.stepBtns}>
//             {step > 1 && (
//               <TouchableOpacity style={styles.backStepBtn} onPress={() => setStep(s => s - 1)}>
//                 <Ionicons name="arrow-back" size={16} color={C.teal} />
//                 <Text style={styles.backStepTxt}>Back</Text>
//               </TouchableOpacity>
//             )}
//             {step < 3 ? (
//               <TouchableOpacity style={[styles.nextStepBtn, { flex: 1 }]} onPress={() => setStep(s => s + 1)}>
//                 <Text style={styles.nextStepTxt}>Continue</Text>
//                 <Ionicons name="arrow-forward" size={16} color="#fff" />
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity style={[styles.nextStepBtn, { flex: 1, backgroundColor: C.teal }]} onPress={submit} disabled={ld}>
//                 {ld ? <ActivityIndicator color="#fff" size="small" /> : (
//                   <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//                     <Ionicons name="send" size={16} color="#fff" />
//                     <Text style={styles.nextStepTxt}>Submit Request</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MOU DETAIL
// // ═══════════════════════════════════════════════════════════════
// function MouDetailScreen({ route }: any) {
//   const { ax } = useUser();
//   const toast = useToast();
//   const [mou, setMou] = useState<any>(null);
//   const [ld, setLd] = useState(true);
//   const [actLd, setActLd] = useState(false);
//   const [tab, setTab] = useState<"details" | "meeting" | "activity">("details");
//   const [respModal, setRespModal] = useState(false);
//   const [mtgModal, setMtgModal] = useState(false);
//   const mouId = route.params?.mouId;

//   useEffect(() => {
//     ax().get(`${API_MOU}/${mouId}`)
//       .then(r => setMou(r.data))
//       .catch(() => {})
//       .finally(() => setLd(false));
//   }, [mouId]);

//   const upd = (u: any) => setMou(u);

//   const doResponse = async (rd: any) => {
//     setActLd(true);
//     try {
//       const lt = rd.type === "accept" ? "industry_approve" : rd.type === "reject" ? "industry_reject" :
//         rd.type === "change" ? "industry_change" : "industry_response";
//       const cl = addCL(mou, lt, { party: "Industry", from: mou.industry, message: rd.message });
//       let ns = mou.status;
//       if (rd.type === "accept") ns = "Approved by Industry";
//       else if (rd.type === "reject") ns = "Rejected";
//       else if (rd.type === "change") ns = "Changes Proposed";
//       else ns = "Industry Responded";
//       const stamp = rd.type === "accept" ? { by: mou.industry, type: "approve", date: new Date().toISOString() } : mou.industryStamp;
//       const pl = { ...bldPayload(mou), status: ns, changeLog: cl, industryStamp: stamp,
//         industryResponseAt: new Date().toISOString(),
//         proposedChanges: rd.changes ? [...(mou.proposedChanges || []), ...rd.changes] : (mou.proposedChanges || []) };
//       const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
//       upd(r.data); setRespModal(false);
//       toast(rd.type === "accept" ? "🎉 MOU Approved!" : rd.type === "reject" ? "MOU Rejected" : "Response sent!",
//         rd.type === "reject" ? "error" : "success");
//     } 
    
//     //catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//      catch (e) {
//   // Ye line aapko screen par asli wajah bataye gi
//   const detailedError = JSON.stringify(e.response?.data) || e.message;
//   console.log("Error Details:", detailedError);
//   Alert.alert("Server Error", detailedError); // Screen par popup aayega
//   toast("Failed to create MOU", "error");
// }
//     finally { setActLd(false); }
//   };

//   const selectSlot = async (opt: any) => {
//     const sl = { date: opt.date || "", time: opt.time || "", note: opt.note || "" };
//     const now = new Date().toISOString();
//     setActLd(true);
//     try {
//       const cl = addCL(mou, "meeting_confirmed", { party: "Industry", from: mou.industry, message: `Confirmed: ${sl.date} at ${sl.time}` });
//       const updMtg = { ...mou.scheduledMeeting, confirmedSlot: sl, confirmedAt: now, industryProposedSlot: null };
//       const pl = { ...bldPayload(mou), scheduledMeeting: updMtg, changeLog: cl };
//       const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
//       upd({ ...r.data, scheduledMeeting: updMtg });
//       toast(`🤝 Meeting confirmed: ${sl.date}!`, "success");
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setActLd(false); }
//   };

//   const proposeSlot = async (sd: any) => {
//     const prop = { date: sd.date || "", time: sd.time || "", note: sd.note || "" };
//     const now = new Date().toISOString();
//     setActLd(true);
//     try {
//       const cl = addCL(mou, "meeting_proposed", { party: "Industry", from: mou.industry, message: `Proposed: ${prop.date} at ${prop.time}` });
//       const updMtg = { ...mou.scheduledMeeting, industryProposedSlot: prop, industryProposedAt: now, confirmedSlot: null };
//       const pl = { ...bldPayload(mou), scheduledMeeting: updMtg, changeLog: cl };
//       const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
//       upd({ ...r.data, scheduledMeeting: updMtg });
//       setMtgModal(false);
//       toast("Slot proposed to University", "info");
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setActLd(false); }
//   };

//   if (ld) return <View style={styles.center}><ActivityIndicator size="large" color={C.teal} /></View>;
//   if (!mou) return <View style={{ flex: 1, backgroundColor: C.bg }}><Header title="MOU" back /></View>;

//   const mtg = mou.scheduledMeeting;
//   const cs = mtg?.confirmedSlot, hasC = !!(cs?.date);
//   const ip = mtg?.industryProposedSlot, hasI = !!(ip?.date);
//   const hasOpts = mtg?.options?.length > 0;
//   const hasSingle = !hasOpts && mtg?.date && mtg?.time;
//   const canResp = ["Sent to Industry", "Changes Proposed"].includes(mou.status);
//   const isMutual = mou.status === "Mutually Approved";

//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title={mou.title || "MOU Detail"} back />

//       {/* Status strip */}
//       <View style={[styles.statusStrip, isMutual && { backgroundColor: "#f0fdf4", borderColor: "#86efac" }]}>
//         <SBadge status={mou.status} />
//         {isMutual && <Text style={{ fontSize: 13, color: "#16a34a", fontWeight: "700" }}>🎉 Fully Finalized</Text>}
//         {canResp && (
//           <TouchableOpacity style={styles.respBtn} onPress={() => setRespModal(true)} disabled={actLd}>
//             <Ionicons name="chatbubble-ellipses" size={14} color="#fff" />
//             <Text style={styles.respBtnTxt}>Respond</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabBar}>
//         {(["details", "meeting", "activity"] as const).map(t => (
//           <TouchableOpacity key={t} style={[styles.tabItem, tab === t && styles.tabItemActive]} onPress={() => setTab(t)}>
//             <Ionicons name={t === "details" ? "document-text-outline" : t === "meeting" ? "calendar-outline" : "time-outline"} size={15} color={tab === t ? C.teal : C.textLight} />
//             <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>
//               {t === "details" ? "Details" : t === "meeting" ? "Meeting" : "Activity"}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>

//         {/* ── DETAILS TAB ── */}
//         {tab === "details" && (
//           <>
//             <InfoCard icon="school-outline" title="Collaboration">
//               <Row label="Type" val={mou.collaborationType} />
//               <Row label="University" val={mou.university} />
//               <Row label="Duration" val={`${fmtDate(mou.startDate)} → ${fmtDate(mou.endDate)}`} />
//             </InfoCard>

//             {mou.description && (
//               <InfoCard icon="document-outline" title="Purpose">
//                 <Text style={styles.infoText}>{mou.description}</Text>
//               </InfoCard>
//             )}

//             {mou.objectives?.filter(Boolean).length > 0 && (
//               <InfoCard icon="list-outline" title="Objectives">
//                 {mou.objectives.filter(Boolean).map((o: string, i: number) => (
//                   <View key={i} style={styles.bulletRow}>
//                     <View style={styles.bullet} />
//                     <Text style={styles.bulletTxt}>{o}</Text>
//                   </View>
//                 ))}
//               </InfoCard>
//             )}

//             {mou.proposedChanges?.length > 0 && (
//               <View style={[styles.infoCardWrap, { borderLeftWidth: 3, borderLeftColor: C.purple }]}>
//                 <View style={styles.infoCardHead}>
//                   <Ionicons name="alert-circle" size={16} color={C.purple} />
//                   <Text style={[styles.infoCardTitle, { color: C.purple }]}>{mou.proposedChanges.length} Proposed Change(s)</Text>
//                 </View>
//                 {mou.proposedChanges.map((ch: any, i: number) => (
//                   <View key={i} style={styles.changeRow}>
//                     <Text style={styles.changeLbl}>{ch.field || `Change #${i + 1}`}</Text>
//                     <Text style={styles.changeVals}>
//                       <Text style={{ color: C.danger, textDecorationLine: "line-through" }}>{ch.oldValue}</Text>
//                       {"  →  "}
//                       <Text style={{ color: C.success }}>{ch.newValue}</Text>
//                     </Text>
//                     {ch.reason && <Text style={styles.changeReason}>Reason: {ch.reason}</Text>}
//                   </View>
//                 ))}
//               </View>
//             )}

//             {/* Stamps */}
//             {(mou.universityStamp || mou.industryStamp) && (
//               <InfoCard icon="ribbon-outline" title="Approvals">
//                 {mou.universityStamp && (
//                   <View style={styles.stampRow}>
//                     <View style={[styles.stampDot, { backgroundColor: mou.universityStamp.type === "approve" ? C.success : C.danger }]} />
//                     <View>
//                       <Text style={styles.stampLbl}>University: {mou.universityStamp.type === "approve" ? "✅ Approved" : "❌ Rejected"}</Text>
//                       <Text style={styles.stampDate}>By {mou.universityStamp.by} · {fmtDate(mou.universityStamp.date)}</Text>
//                     </View>
//                   </View>
//                 )}
//                 {mou.industryStamp && (
//                   <View style={styles.stampRow}>
//                     <View style={[styles.stampDot, { backgroundColor: mou.industryStamp.type === "approve" ? C.success : C.danger }]} />
//                     <View>
//                       <Text style={styles.stampLbl}>Industry: {mou.industryStamp.type === "approve" ? "✅ Approved" : "❌ Rejected"}</Text>
//                       <Text style={styles.stampDate}>By {mou.industryStamp.by} · {fmtDate(mou.industryStamp.date)}</Text>
//                     </View>
//                   </View>
//                 )}
//               </InfoCard>
//             )}
//           </>
//         )}

//         {/* ── MEETING TAB ── */}
//         {tab === "meeting" && (
//           <>
//             {!mtg && (
//               <View style={styles.emptyState}>
//                 <Ionicons name="calendar-outline" size={56} color={C.textLight} />
//                 <Text style={styles.emptyTitle}>No meeting scheduled</Text>
//                 <Text style={styles.emptySub}>University will propose a time slot</Text>
//               </View>
//             )}

//             {/* STATE 1: Confirmed */}
//             {mtg && hasC && (
//               <View style={styles.confirmedCard}>
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
//                   <View style={styles.confirmedIcon}>
//                     <Ionicons name="checkmark-circle" size={22} color="#fff" />
//                   </View>
//                   <Text style={styles.confirmedTitle}>Meeting Confirmed! 🎉</Text>
//                 </View>
//                 <View style={{ flexDirection: "row", gap: 12 }}>
//                   <View style={styles.dtCell}>
//                     <Text style={styles.dtLabel}>DATE</Text>
//                     <Text style={styles.dtVal}>{cs!.date}</Text>
//                   </View>
//                   <View style={styles.dtCell}>
//                     <Text style={styles.dtLabel}>TIME</Text>
//                     <Text style={styles.dtVal}>🕐 {cs!.time}</Text>
//                   </View>
//                 </View>
//                 {mtg.venue && <Text style={styles.mtgMeta}>📍 {mtg.venue}</Text>}
//                 {mtg.agenda && <Text style={styles.mtgMeta}>📋 {mtg.agenda}</Text>}
//                 {cs!.note && <Text style={styles.mtgMeta}>📌 {cs!.note}</Text>}
//                 <Text style={styles.confirmedSince}>Confirmed · {fmtDT(mtg.confirmedAt)}</Text>
//               </View>
//             )}

//             {/* STATE 2: Industry proposed, awaiting uni */}
//             {mtg && !hasC && hasI && (
//               <View style={styles.pendingCard}>
//                 <Text style={styles.pendingTitle}>⏳ Awaiting University Confirmation</Text>
//                 <Text style={styles.pendingSub}>You proposed:</Text>
//                 <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
//                   <View style={[styles.dtCell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}>
//                     <Text style={[styles.dtLabel, { color: "#92400e" }]}>DATE</Text>
//                     <Text style={[styles.dtVal, { color: "#92400e" }]}>{ip!.date}</Text>
//                   </View>
//                   <View style={[styles.dtCell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}>
//                     <Text style={[styles.dtLabel, { color: "#92400e" }]}>TIME</Text>
//                     <Text style={[styles.dtVal, { color: "#92400e" }]}>🕐 {ip!.time}</Text>
//                   </View>
//                 </View>
//                 {ip!.note && <Text style={{ fontSize: 12, color: "#a16207" }}>📌 {ip!.note}</Text>}
//                 <TouchableOpacity style={styles.outlineBtn} onPress={() => setMtgModal(true)}>
//                   <Ionicons name="pencil" size={13} color={C.teal} />
//                   <Text style={styles.outlineTxt}>Change Slot</Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             {/* STATE 3: Options */}
//             {mtg && !hasC && !hasI && hasOpts && (
//               <>
//                 <View style={styles.infoNote}>
//                   <Ionicons name="information-circle" size={16} color="#0284c7" />
//                   <Text style={styles.infoNoteTxt}>Select a slot or propose your own time</Text>
//                 </View>
//                 {mtg.options.map((opt: any, i: number) => (
//                   <View key={i} style={styles.slotCard}>
//                     <View style={{ flex: 1 }}>
//                       <Text style={styles.slotDate}>{opt.date} at {opt.time}</Text>
//                       {opt.note && <Text style={styles.slotNote}>{opt.note}</Text>}
//                     </View>
//                     <TouchableOpacity style={styles.selectBtn} onPress={() => selectSlot(opt)} disabled={actLd}>
//                       {actLd ? <ActivityIndicator color="#fff" size="small" /> : (
//                         <><Ionicons name="checkmark" size={14} color="#fff" /><Text style={styles.selectTxt}>Select</Text></>
//                       )}
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//                 {mtg.venue && <Text style={[styles.mtgMeta, { marginTop: 8 }]}>📍 {mtg.venue}</Text>}
//                 {mtg.agenda && <Text style={styles.mtgMeta}>📋 {mtg.agenda}</Text>}
//                 <TouchableOpacity style={styles.outlineBtn} onPress={() => setMtgModal(true)}>
//                   <Ionicons name="pencil" size={13} color={C.teal} />
//                   <Text style={styles.outlineTxt}>Propose Different Slot</Text>
//                 </TouchableOpacity>
//               </>
//             )}

//             {/* STATE 4: Single slot */}
//             {mtg && !hasC && !hasI && hasSingle && (
//               <>
//                 <View style={styles.infoNote}>
//                   <Ionicons name="information-circle" size={16} color="#0284c7" />
//                   <Text style={styles.infoNoteTxt}>University proposed this time</Text>
//                 </View>
//                 <View style={styles.slotCard}>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.slotDate}>{fmtDate(mtg.date)} at {mtg.time}</Text>
//                     {mtg.venue && <Text style={styles.slotNote}>📍 {mtg.venue}</Text>}
//                     {mtg.agenda && <Text style={styles.slotNote}>📋 {mtg.agenda}</Text>}
//                   </View>
//                 </View>
//                 <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
//                   <TouchableOpacity style={[styles.selectBtn, { flex: 1, justifyContent: "center", paddingVertical: 12 }]}
//                     onPress={() => selectSlot({ date: mtg.date, time: mtg.time, note: "" })} disabled={actLd}>
//                     {actLd ? <ActivityIndicator color="#fff" size="small" /> : (
//                       <><Ionicons name="checkmark-circle" size={15} color="#fff" /><Text style={styles.selectTxt}>Confirm This Slot</Text></>
//                     )}
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.outlineBtn, { flex: 1, justifyContent: "center" }]} onPress={() => setMtgModal(true)}>
//                     <Ionicons name="pencil" size={13} color={C.teal} />
//                     <Text style={styles.outlineTxt}>Propose New</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </>
//         )}

//         {/* ── ACTIVITY TAB ── */}
//         {tab === "activity" && (
//           <>
//             {hasC && (
//               <View style={[styles.confirmedCard, { marginBottom: 16 }]}>
//                 <Text style={{ fontSize: 13, fontWeight: "700", color: "#166534", marginBottom: 8 }}>✅ Meeting Confirmed</Text>
//                 <View style={{ flexDirection: "row", gap: 12 }}>
//                   <View style={styles.dtCell}><Text style={styles.dtLabel}>DATE</Text><Text style={styles.dtVal}>{cs!.date}</Text></View>
//                   <View style={styles.dtCell}><Text style={styles.dtLabel}>TIME</Text><Text style={styles.dtVal}>🕐 {cs!.time}</Text></View>
//                 </View>
//               </View>
//             )}

//             <Text style={styles.actSection}>Timeline</Text>
//             {[
//               { lbl: "Draft Created",     date: mou.createdAt,          done: true },
//               { lbl: "Sent to Industry",  date: mou.sentAt,             done: !!mou.sentAt },
//               { lbl: "Our Response",      date: mou.industryResponseAt, done: !!mou.industryResponseAt },
//               { lbl: "Meeting Confirmed", date: mtg?.confirmedAt,       done: hasC },
//               { lbl: "Mutually Approved", date: null,                   done: isMutual },
//             ].map((t, i) => (
//               <View key={i} style={styles.tlRow}>
//                 <View style={[styles.tlDot, { backgroundColor: t.done ? C.success : C.border }]}>
//                   {t.done && <Ionicons name="checkmark" size={10} color="#fff" />}
//                 </View>
//                 <View style={styles.tlLine} />
//                 <View>
//                   <Text style={[styles.tlLbl, { color: t.done ? C.text : C.textLight }]}>{t.lbl}</Text>
//                   {t.date && <Text style={styles.tlDate}>{fmtDate(t.date)}</Text>}
//                 </View>
//               </View>
//             ))}

//             {(mou.changeLog || []).length > 0 && (
//               <>
//                 <Text style={[styles.actSection, { marginTop: 20 }]}>All Activity</Text>
//                 {[...(mou.changeLog || [])].reverse().map((e: any, i: number) => {
//                   const ct = CT[e.type] || { c: C.textLight, bg: C.bg, ic: "📌", lbl: e.type };
//                   return (
//                     <View key={e.id || i} style={[styles.logCard, { backgroundColor: ct.bg, borderColor: ct.c + "30" }]}>
//                       <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
//                         <Text style={{ fontSize: 14 }}>{ct.ic}</Text>
//                         <Text style={{ fontSize: 11, fontWeight: "700", color: ct.c }}>{ct.lbl}</Text>
//                         <Text style={{ marginLeft: "auto", fontSize: 10, color: C.textLight }}>{e.party}</Text>
//                       </View>
//                       {e.message && <Text style={{ fontSize: 12, color: C.text, lineHeight: 18 }}>{e.message}</Text>}
//                       <Text style={{ fontSize: 10, color: C.textLight, marginTop: 4 }}>{fmtDT(e.date)}</Text>
//                     </View>
//                   );
//                 })}
//               </>
//             )}
//           </>
//         )}
//       </ScrollView>

//       <RespModal    visible={respModal} mou={mou} onClose={() => setRespModal(false)} onSave={doResponse} loading={actLd} />
//       <PropMtgModal visible={mtgModal}  mou={mou} onClose={() => setMtgModal(false)}  onSave={proposeSlot} loading={actLd} />
//     </View>
//   );
// }

// // ─── Response Modal ───────────────────────────────────────────
// const RespModal = ({ visible, mou, onClose, onSave, loading }: any) => {
//   const [type, setType] = useState<"accept" | "reject" | "comment" | "change">("comment");
//   const [msg,  setMsg]  = useState("");
//   const [changes, setChanges] = useState([{ field: "", oldValue: "", newValue: "", reason: "" }]);

//   const cfg = {
//     accept:  { c: "#16a34a", bg: "#f0fdf4", lbl: "Accept MOU",      icon: "thumbs-up-outline" },
//     reject:  { c: "#dc2626", bg: "#fef2f2", lbl: "Reject MOU",      icon: "thumbs-down-outline" },
//     comment: { c: "#0284c7", bg: "#eff6ff", lbl: "Comment",         icon: "chatbubble-outline" },
//     change:  { c: "#7c3aed", bg: "#f5f3ff", lbl: "Propose Changes", icon: "git-pull-request-outline" },
//   };

//   const submit = () => {
//     if (!msg.trim() && type !== "accept" && type !== "reject") { Alert.alert("Required", "Enter a message."); return; }
//     onSave({ type, message: msg || (type === "accept" ? `${mou?.industry} accepted.` : `${mou?.industry} rejected.`),
//       changes: type === "change" ? changes.filter(c => c.field).map(c => ({ ...c, date: new Date().toISOString() })) : undefined });
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.sheet}>
//           <View style={styles.sheetHandle} />
//           <View style={styles.sheetHead}>
//             <Text style={styles.sheetTitle}>Respond to MOU</Text>
//             <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.text} /></TouchableOpacity>
//           </View>
//           <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
//             <Text style={styles.fieldLbl}>Response Type</Text>
//             <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 16 }}>
//               {(Object.keys(cfg) as Array<keyof typeof cfg>).map(k => (
//                 <TouchableOpacity key={k}
//                   style={[styles.respTypeBtn, type === k && { borderColor: cfg[k].c, backgroundColor: cfg[k].bg }]}
//                   onPress={() => setType(k)}>
//                   <Ionicons name={cfg[k].icon as any} size={14} color={type === k ? cfg[k].c : C.textLight} />
//                   <Text style={[styles.respTypeTxt, type === k && { color: cfg[k].c }]}>{cfg[k].lbl}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <FieldInput label={type === "accept" ? "Acceptance Note (optional)" : "Message *"}
//               value={msg} onChange={setMsg}
//               placeholder={type === "accept" ? "e.g. We accept as presented." : type === "reject" ? "Reason for rejection..." : "Your message..."} multiline />

//             {type === "change" && (
//               <>
//                 <Text style={[styles.fieldLbl, { color: C.purple, marginTop: 8 }]}>Proposed Changes</Text>
//                 {changes.map((ch, i) => (
//                   <View key={i} style={styles.changeBlock}>
//                     <TextInput style={styles.fieldInput} placeholder="Field / Section" value={ch.field}
//                       onChangeText={v => { const a = [...changes]; a[i].field = v; setChanges(a); }} />
//                     <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
//                       <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} placeholder="Current value"
//                         value={ch.oldValue} onChangeText={v => { const a = [...changes]; a[i].oldValue = v; setChanges(a); }} />
//                       <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} placeholder="New value"
//                         value={ch.newValue} onChangeText={v => { const a = [...changes]; a[i].newValue = v; setChanges(a); }} />
//                     </View>
//                     <TextInput style={[styles.fieldInput, { marginTop: 6 }]} placeholder="Reason for change"
//                       value={ch.reason} onChangeText={v => { const a = [...changes]; a[i].reason = v; setChanges(a); }} />
//                   </View>
//                 ))}
//                 <TouchableOpacity onPress={() => setChanges(c => [...c, { field: "", oldValue: "", newValue: "", reason: "" }])}>
//                   <Text style={{ color: C.purple, fontWeight: "700", textAlign: "center", marginTop: 4 }}>+ Add Change</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </ScrollView>
//           <View style={styles.sheetFoot}>
//             <TouchableOpacity onPress={onClose} style={{ paddingHorizontal: 16, justifyContent: "center" }}>
//               <Text style={{ color: C.textLight, fontWeight: "600" }}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.saveBtn, { flex: 1, backgroundColor: (cfg[type] as any).c }]} onPress={submit} disabled={loading}>
//               {loading ? <ActivityIndicator color="#fff" size="small" /> :
//                 <Text style={styles.saveBtnTxt}>Submit Response</Text>}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ─── Propose Meeting Modal ────────────────────────────────────
// const PropMtgModal = ({ visible, mou, onClose, onSave, loading }: any) => {
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [note, setNote] = useState("");
//   const mtg = mou?.scheduledMeeting;

//   const useOpt = (o: any) => { setDate(o.date || ""); setTime(o.time || ""); setNote(o.note || ""); };

//   const submit = () => {
//     if (!date || !time) { Alert.alert("Required", "Enter date and time."); return; }
//     onSave({ date, time, note });
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.sheet}>
//           <View style={styles.sheetHandle} />
//           <View style={styles.sheetHead}>
//             <Text style={styles.sheetTitle}>Propose Meeting Slot</Text>
//             <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.text} /></TouchableOpacity>
//           </View>
//           <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
//             <View style={styles.infoNote}>
//               <Ionicons name="information-circle" size={16} color="#0284c7" />
//               <Text style={styles.infoNoteTxt}>University will review and confirm your proposed slot.</Text>
//             </View>

//             {mtg?.options?.length > 0 && (
//               <>
//                 <Text style={[styles.fieldLbl, { marginTop: 12 }]}>University's options (tap to use):</Text>
//                 {mtg.options.map((o: any, i: number) => (
//                   <TouchableOpacity key={i} style={styles.optRow} onPress={() => useOpt(o)}>
//                     <Text style={styles.optTxt}>{o.date} at {o.time}</Text>
//                     <Text style={{ color: C.teal, fontWeight: "700", fontSize: 12 }}>Use</Text>
//                   </TouchableOpacity>
//                 ))}
//               </>
//             )}
//             {mtg?.date && !mtg?.options?.length && (
//               <TouchableOpacity style={styles.optRow} onPress={() => useOpt({ date: mtg.date, time: mtg.time })}>
//                 <Text style={styles.optTxt}>{fmtDate(mtg.date)} at {mtg.time}</Text>
//                 <Text style={{ color: C.teal, fontWeight: "700", fontSize: 12 }}>Use</Text>
//               </TouchableOpacity>
//             )}

//             <Text style={[styles.fieldLbl, { marginTop: 16 }]}>Your Preferred Slot:</Text>
//             <FieldInput label="Date (YYYY-MM-DD) *" value={date} onChange={setDate} placeholder="e.g. 2025-08-15" />
//             <FieldInput label="Time (HH:MM) *" value={time} onChange={setTime} placeholder="e.g. 10:00" />
//             <FieldInput label="Note (optional)" value={note} onChange={setNote} placeholder="e.g. Prefer morning" />
//           </ScrollView>
//           <View style={styles.sheetFoot}>
//             <TouchableOpacity onPress={onClose} style={{ paddingHorizontal: 16, justifyContent: "center" }}>
//               <Text style={{ color: C.textLight, fontWeight: "600" }}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.saveBtn, { flex: 1 }]} onPress={submit} disabled={loading}>
//               {loading ? <ActivityIndicator color="#fff" size="small" /> : (
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
//                   <Ionicons name="send" size={14} color="#fff" />
//                   <Text style={styles.saveBtnTxt}>Submit to University</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// //  INTERNSHIPS
// // ═══════════════════════════════════════════════════════════════
// function InternshipsMainScreen() {
//   const nav = useNavigation<any>();
//   const { ax } = useUser();
//   const [items, setItems] = useState<any[]>([]);
//   const [ld, setLd] = useState(true);
//   useEffect(() => { ax().get(API_INT).then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLd(false)); }, []);
//   if (ld) return <View style={styles.center}><ActivityIndicator color={C.teal} /></View>;
//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="Internships" back />
//       <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
//         <TouchableOpacity style={styles.createBtn} onPress={() => nav.navigate("PostNewInternship")}>
//           <Ionicons name="add-circle" size={20} color="#fff" />
//           <Text style={styles.createBtnTxt}>Post New Internship</Text>
//         </TouchableOpacity>
//         {items.length === 0 && (
//           <View style={styles.emptyState}>
//             <Ionicons name="briefcase-outline" size={56} color={C.textLight} />
//             <Text style={styles.emptyTitle}>No internships yet</Text>
//           </View>
//         )}
//         {items.map((item: any) => (
//           <View key={item._id || item.id} style={styles.listCard}>
//             <Text style={styles.listCardTitle}>{item.title}</Text>
//             <Text style={styles.listCardSub}>{item.company}</Text>
//             <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
//               <Text style={styles.listCardMeta}>Posted: {fmtDate(item.date || item.createdAt)}</Text>
//               <Text style={styles.listCardMeta}>{item.applications || 0} Applicants</Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// function PostNewInternshipScreen() {
//   const nav = useNavigation<any>();
//   const { user, ax } = useUser();
//   const toast = useToast();
//   const [title, setTitle] = useState("");
//   const [skills, setSkills] = useState("");
//   const [desc, setDesc] = useState("");
//   const [ld, setLd] = useState(false);
//   const submit = async () => {
//     if (!title) { toast("Title required", "error"); return; }
//     setLd(true);
//     try {
//       await ax().post(API_INT, { title, company: user?.name || "", skills, description: desc });
//       toast("Internship posted!", "success"); nav.goBack();
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setLd(false); }
//   };
//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="New Internship" back />
//       <ScrollView contentContainerStyle={styles.formPad}>
//         <FieldInput label="Job Title *" value={title} onChange={setTitle} placeholder="e.g. React Developer" />
//         <FieldInput label="Required Skills" value={skills} onChange={setSkills} placeholder="e.g. JavaScript, React" />
//         <FieldInput label="Description" value={desc} onChange={setDesc} placeholder="Responsibilities..." multiline />
//         <TouchableOpacity style={[styles.saveBtn, { marginTop: 24 }]} onPress={submit} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnTxt}>Publish Internship</Text>}
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  PROJECTS
// // ═══════════════════════════════════════════════════════════════
// function ManageProjectsScreen() {
//   const nav = useNavigation<any>();
//   const { ax } = useUser();
//   const [items, setItems] = useState<any[]>([]);
//   const [ld, setLd] = useState(true);
//   useEffect(() => { ax().get(API_PROJ).then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLd(false)); }, []);
//   if (ld) return <View style={styles.center}><ActivityIndicator color={C.teal} /></View>;
//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="Projects" back />
//       <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
//         <TouchableOpacity style={styles.createBtn} onPress={() => nav.navigate("PostNewProject")}>
//           <Ionicons name="add-circle" size={20} color="#fff" />
//           <Text style={styles.createBtnTxt}>Add New Project</Text>
//         </TouchableOpacity>
//         {items.length === 0 && (
//           <View style={styles.emptyState}>
//             <Ionicons name="flask-outline" size={56} color={C.textLight} />
//             <Text style={styles.emptyTitle}>No projects yet</Text>
//           </View>
//         )}
//         {items.map((item: any) => (
//           <View key={item._id || item.id} style={styles.listCard}>
//             <Text style={styles.listCardTitle}>{item.title}</Text>
//             <Text style={styles.listCardSub}>{item.type}</Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// function PostNewProjectScreen() {
//   const nav = useNavigation<any>();
//   const { ax } = useUser();
//   const toast = useToast();
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState("Research");
//   const [desc, setDesc] = useState("");
//   const [ld, setLd] = useState(false);
//   const submit = async () => {
//     if (!title) { toast("Title required", "error"); return; }
//     setLd(true);
//     try {
//       await ax().post(API_PROJ, { title, type, description: desc });
//       toast("Project added!", "success"); nav.goBack();
//     } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setLd(false); }
//   };
//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="New Project" back />
//       <ScrollView contentContainerStyle={styles.formPad}>
//         <FieldInput label="Project Title *" value={title} onChange={setTitle} />
//         <Text style={styles.fieldLbl}>Type</Text>
//         <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 12 }}>
//           {["Research", "Development", "Collaboration"].map(t => (
//             <TouchableOpacity key={t} onPress={() => setType(t)}
//               style={[styles.typeChip, type === t && styles.typeChipActive]}>
//               <Text style={[styles.typeChipTxt, type === t && styles.typeChipTxtActive]}>{t}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <FieldInput label="Description" value={desc} onChange={setDesc} multiline />
//         <TouchableOpacity style={[styles.saveBtn, { marginTop: 24 }]} onPress={submit} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnTxt}>Save Project</Text>}
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MESSAGES
// // ═══════════════════════════════════════════════════════════════
// function MessagesScreen() {
//   const nav = useNavigation<any>();
//   const chats = [
//     { id: 1, name: "Internship Incharge", sub: "Riphah International University", time: "10:30 AM", msg: "Research grant approved.", avatar: "https://ui-avatars.com/api/?name=II&background=0F2236&color=fff&bold=true", unread: 2 },
//     { id: 2, name: "Industry Liaison",     sub: "Riphah International University", time: "Yesterday", msg: "When can we meet?", avatar: "https://ui-avatars.com/api/?name=IL&background=0D7377&color=fff&bold=true", unread: 0 },
//   ];
//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="Messages" back />
//       <FlatList data={chats} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.chatItem} onPress={() => nav.navigate("ChatScreen", { contact: item })}>
//             <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
//             <View style={{ flex: 1 }}>
//               <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                 <Text style={styles.chatName}>{item.name}</Text>
//                 <Text style={styles.chatTime}>{item.time}</Text>
//               </View>
//               <Text style={styles.chatSub}>{item.sub}</Text>
//               <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//                 <Text style={[styles.chatMsg, item.unread > 0 && { fontWeight: "700", color: C.text }]} numberOfLines={1}>{item.msg}</Text>
//                 {item.unread > 0 && <View style={styles.unreadDot}><Text style={styles.unreadNum}>{item.unread}</Text></View>}
//               </View>
//             </View>
//           </TouchableOpacity>
//         )} />
//     </View>
//   );
// }

// function ChatScreen({ route }: any) {
//   const nav = useNavigation<any>();
//   const { contact } = route.params || { contact: { name: "University", avatar: "https://ui-avatars.com/api/?name=U" } };
//   const [messages, setMessages] = useState([{ id: 1, text: "Hello! How can we help?", sender: "them", time: "10:00" }]);
//   const [input, setInput] = useState("");
//   const flatRef = useRef<FlatList>(null);
//   const send = () => {
//     if (!input.trim()) return;
//     const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     setMessages(p => [...p, { id: Date.now(), text: input, sender: "me", time: now }]);
//     setInput("");
//     setTimeout(() => setMessages(p => [...p, { id: Date.now() + 1, text: "Sure, let me check.", sender: "them", time: now }]), 1500);
//   };
//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
//       <View style={styles.chatHdr}>
//         <TouchableOpacity onPress={() => nav.goBack()}><Ionicons name="arrow-back" size={24} color={C.navy} /></TouchableOpacity>
//         <Image source={{ uri: contact.avatar }} style={styles.chatHdrAvt} />
//         <View><Text style={styles.chatHdrName}>{contact.name}</Text><Text style={{ fontSize: 11, color: C.success }}>Online</Text></View>
//       </View>
//       <FlatList ref={flatRef} data={messages} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
//         onContentSizeChange={() => flatRef.current?.scrollToEnd()}
//         renderItem={({ item }) => (
//           <View style={[styles.bubble, item.sender === "me" ? styles.bubbleMe : styles.bubbleThem]}>
//             <Text style={{ color: item.sender === "me" ? "#fff" : C.text }}>{item.text}</Text>
//             <Text style={{ fontSize: 10, color: item.sender === "me" ? "#ffffffaa" : C.textLight, marginTop: 3, alignSelf: "flex-end" }}>{item.time}</Text>
//           </View>
//         )} />
//       <View style={styles.inputRow}>
//         <TextInput style={styles.chatInput} value={input} onChangeText={setInput} placeholder="Type a message..." />
//         <TouchableOpacity style={styles.sendBtn} onPress={send}><Ionicons name="send" size={18} color="#fff" /></TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  AI CHATBOT
// // ═══════════════════════════════════════════════════════════════
// function AIChatbotScreen() {
//   const nav = useNavigation<any>();
//   const [msgs, setMsgs] = useState([{ id: 1, text: "Hello! I am CXbot. How can I help with your MOU or partnerships?", sender: "bot" }]);
//   const [input, setInput] = useState("");
//   const [typing, setTyping] = useState(false);
//   const flatRef = useRef<FlatList>(null);
//   const respond = (text: string) => {
//     if (!text.trim()) return;
//     setMsgs(p => [...p, { id: Date.now(), text, sender: "user" }]);
//     setInput(""); setTyping(true);
//     setTimeout(() => {
//       const t = text.toLowerCase();
//       const reply =
//         t.includes("mou") ? "Manage all MOUs in the MOU section. You can respond, propose changes, or confirm meetings." :
//         t.includes("meeting") ? "Check the Meeting tab in any MOU for scheduling options." :
//         t.includes("internship") ? "Post internships from the Internships section." :
//         t.includes("profile") ? "Update your company profile from the drawer menu." :
//         "I can help with MOUs, internships, projects, and more. What do you need?";
//       setMsgs(p => [...p, { id: Date.now() + 1, text: reply, sender: "bot" }]);
//       setTyping(false);
//     }, 1800);
//   };
//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="CXbot AI" back />
//       <FlatList ref={flatRef} data={msgs} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
//         onContentSizeChange={() => flatRef.current?.scrollToEnd()}
//         ListFooterComponent={typing ? <Text style={{ color: C.textLight, marginLeft: 12, marginTop: 4, fontSize: 12 }}>CXbot is typing...</Text> : null}
//         renderItem={({ item }) => (
//           <View style={[styles.bubble, item.sender === "user" ? styles.bubbleMe : { ...styles.bubbleThem, backgroundColor: "#E0F7F7" }]}>
//             {item.sender === "bot" && <View style={styles.botIcon}><Ionicons name="sparkles" size={12} color="#fff" /></View>}
//             <Text style={{ color: item.sender === "user" ? "#fff" : C.text }}>{item.text}</Text>
//           </View>
//         )} />
//       <View style={styles.inputRow}>
//         <TextInput style={styles.chatInput} value={input} onChangeText={setInput} placeholder="Ask CXbot anything..." />
//         <TouchableOpacity style={[styles.sendBtn, { backgroundColor: C.teal }]} onPress={() => respond(input)}>
//           <Ionicons name="arrow-up" size={20} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  DRAWER
// // ═══════════════════════════════════════════════════════════════
// function CustomDrawer(props: any) {
//   const { user } = useUser();
//   const nav = useNavigation<any>();
//   const initials = (n: string) => n?.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "CX";

//   const drawerItems = [
//     { screen: "Dashboard",       icon: "grid-outline",           label: "Dashboard" },
//     { screen: "MoUs",            icon: "document-text-outline",  label: "MOU Management" },
//     { screen: "InternshipsMain", icon: "briefcase-outline",      label: "Internships" },
//     { screen: "ManageProjects",  icon: "flask-outline",          label: "Projects" },
//     { screen: "MessagesMain",    icon: "chatbubbles-outline",    label: "Messages" },
//     { screen: "AIChatbot",       icon: "sparkles-outline",       label: "CXbot AI" },
//     { screen: "Profile",         icon: "person-circle-outline",  label: "My Profile" },
//   ];

//   const current = props.state?.routes[props.state?.index]?.name;

//   return (
//     <View style={{ flex: 1, backgroundColor: C.white }}>
//       {/* Drawer Header */}
//       <View style={styles.drawerTop}>
//         <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
//           <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
//             <View style={styles.drawerLogoBox}>
//               <Text style={styles.drawerLogoTxt}>CX</Text>
//             </View>
//             <Text style={styles.drawerBrandTxt}>Colla<Text style={{ color: C.goldLight }}>X</Text>ion</Text>
//           </View>
//           <TouchableOpacity onPress={() => nav.closeDrawer()} style={styles.drawerClose}>
//             <Ionicons name="close" size={20} color="rgba(255,255,255,0.7)" />
//           </TouchableOpacity>
//         </View>

//         {/* Profile Row */}
//         <TouchableOpacity style={styles.drawerProfileRow} onPress={() => { nav.navigate("Profile"); nav.closeDrawer(); }}>
//           <View style={styles.drawerAvatar}>
//             {user?.logo
//               ? <Image source={{ uri: user.logo }} style={styles.drawerAvatarImg} />
//               : <Text style={styles.drawerAvatarTxt}>{initials(user?.name || "CX")}</Text>}
//           </View>
//           <View style={{ flex: 1, marginLeft: 12 }}>
//             <Text style={styles.drawerUserName} numberOfLines={1}>{user?.name || "Partner"}</Text>
//             <Text style={styles.drawerUserSub}>{user?.industry || "Industry Partner"}</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.5)" />
//         </TouchableOpacity>



//       </View>

//       {/* Nav Items */}
//       <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
//         <View style={{ paddingHorizontal: 12, paddingTop: 16 }}>
//           {drawerItems.map((item, i) => {
//             const active = current === item.screen;
//             return (
//               <TouchableOpacity key={i} style={[styles.drawerItem, active && styles.drawerItemActive]}
//                 onPress={() => { nav.navigate(item.screen); nav.closeDrawer(); }}>
//                 <View style={[styles.drawerItemIcon, { backgroundColor: active ? C.navy + "15" : "transparent" }]}>
//                   <Ionicons name={item.icon as any} size={20} color={active ? C.navy : C.textMid} />
//                 </View>
//                 <Text style={[styles.drawerItemTxt, active && { color: C.navy, fontWeight: "700" }]}>{item.label}</Text>
//                 {active && <View style={styles.drawerActiveDot} />}
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         <View style={styles.drawerFooter}>
//           <Text style={styles.drawerFooterTxt}>CollaXion v2.0</Text>
//           <Text style={styles.drawerFooterSub}>Industry Partner Portal</Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  SMALL REUSABLE COMPONENTS
// // ═══════════════════════════════════════════════════════════════
// const FieldInput = ({ label, value, onChange, placeholder, multiline, editable = true, kbType }: any) => (
//   <View style={{ marginBottom: 12 }}>
//     {label && <Text style={styles.fieldLbl}>{label}</Text>}
//     <TextInput
//       style={[styles.fieldInput, multiline && { height: 90, textAlignVertical: "top" }, !editable && { backgroundColor: "#F3F4F6", color: C.textLight }]}
//       value={value} onChangeText={onChange} placeholder={placeholder}
//       placeholderTextColor={C.textLight} multiline={multiline} editable={editable}
//       keyboardType={kbType || "default"} autoCapitalize="none" />
//   </View>
// );

// const InfoCard = ({ icon, title, children }: any) => (
//   <View style={styles.infoCardWrap}>
//     <View style={styles.infoCardHead}>
//       <Ionicons name={icon} size={16} color={C.teal} />
//       <Text style={styles.infoCardTitle}>{title}</Text>
//     </View>
//     {children}
//   </View>
// );

// const Row = ({ label, val }: any) => (
//   <View style={styles.infoRow}>
//     <Text style={styles.infoRowLbl}>{label}</Text>
//     <Text style={styles.infoRowVal}>{val || "—"}</Text>
//   </View>
// );

// // ═══════════════════════════════════════════════════════════════
// //  NAVIGATION
// // ═══════════════════════════════════════════════════════════════
// const Drawer = createDrawerNavigator();
// const Stack  = createNativeStackNavigator();

// function MainDrawer() {
//   return (
//     <Drawer.Navigator
//       drawerContent={props => <CustomDrawer {...props} />}
//       screenOptions={{ headerShown: false, drawerStyle: { width: width * 0.80 } }}>
//       <Drawer.Screen name="Dashboard"        component={DashboardScreen} />
//       <Drawer.Screen name="MoUs"             component={MoUScreen} />
//       <Drawer.Screen name="InternshipsMain"  component={InternshipsMainScreen} />
//       <Drawer.Screen name="ManageProjects"   component={ManageProjectsScreen} />
//       <Drawer.Screen name="MessagesMain"     component={MessagesScreen} />
//       <Drawer.Screen name="AIChatbot"        component={AIChatbotScreen} />
//       <Drawer.Screen name="Profile"          component={ProfileScreen} />
//       {/* Hidden */}
//       <Drawer.Screen name="CreateMoU"           component={CreateMoUScreen}          options={{ drawerItemStyle: { display: "none" } }} />
//       <Drawer.Screen name="PostNewInternship"   component={PostNewInternshipScreen}  options={{ drawerItemStyle: { display: "none" } }} />
//       <Drawer.Screen name="PostNewProject"      component={PostNewProjectScreen}     options={{ drawerItemStyle: { display: "none" } }} />
//       <Drawer.Screen name="ChatScreen"          component={ChatScreen}               options={{ drawerItemStyle: { display: "none" } }} />
//     </Drawer.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <UserProvider>
//       <ToastProvider>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="MainDrawer" component={MainDrawer} />
//           <Stack.Screen name="MouDetail"  component={MouDetailScreen} />
//         </Stack.Navigator>
//       </ToastProvider>
//     </UserProvider>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  STYLES
// // ═══════════════════════════════════════════════════════════════
// const styles = StyleSheet.create({
//   center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.bg },

//   // Toast
//   toast: { position: "absolute", top: Platform.OS === "ios" ? 56 : 40, left: 12, right: 12,
//     flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 14,
//     borderRadius: 16, borderWidth: 1, elevation: 12, zIndex: 9999 },
//   toastTxt: { fontSize: 13, fontWeight: "700", flex: 1 },

//   // Header
//   hdr: { backgroundColor: C.white, paddingTop: Platform.OS === "ios" ? 52 : 42, paddingBottom: 14,
//     paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//     elevation: 2, borderBottomWidth: 1, borderColor: C.border },
//   hdrTitle: { flex: 1, fontSize: 17, fontWeight: "700", color: C.navy, marginHorizontal: 12 },
//   hdrBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
//   hdrAction: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.teal,
//     justifyContent: "center", alignItems: "center" },

//   // Badge
//   badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
//   badgeTxt: { fontSize: 10, fontWeight: "700" },

//   // ── DASHBOARD ──
//   dashBanner: { backgroundColor: C.navy, paddingTop: Platform.OS === "ios" ? 56 : 46, paddingBottom: 24, paddingHorizontal: 20 },
//   dashBannerContent: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
//   dashMenuBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
//   dashGreet: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: "500" },
//   dashName:  { fontSize: 18, fontWeight: "800", color: C.white },
//   dashAvatar:{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.teal,
//     justifyContent: "center", alignItems: "center", overflow: "hidden",
//     borderWidth: 2, borderColor: C.goldLight, position: "relative" },
//   dashAvatarImg: { width: 44, height: 44, borderRadius: 22 },
//   dashAvatarTxt: { fontSize: 15, fontWeight: "900", color: "#fff" },
//   dashAvatarDot: { position: "absolute", bottom: 1, right: 1, width: 10, height: 10,
//     borderRadius: 5, backgroundColor: C.success, borderWidth: 1.5, borderColor: C.navy },

//   statsRow: { flexDirection: "row", justifyContent: "space-between" },
//   statPill: { flex: 1, alignItems: "center", paddingVertical: 12,
//     borderRadius: 14, backgroundColor: "rgba(255,255,255,0.08)", marginHorizontal: 3 },
//   statN:   { fontSize: 22, fontWeight: "900", color: C.white },
//   statLbl: { fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 2, fontWeight: "600" },

//   alertBanner: { marginHorizontal: 16, marginTop: 16, flexDirection: "row", alignItems: "center",
//     backgroundColor: "#FFF8E6", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#F0C96A44",
//     gap: 8 },
//   alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.gold },
//   alertTxt: { flex: 1, fontSize: 13, color: "#92400E", fontWeight: "600" },

//   sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//     paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
//   sectionTitle: { fontSize: 16, fontWeight: "800", color: C.navy },
//   seeAll: { fontSize: 13, color: C.teal, fontWeight: "700" },

//   actionsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 8, marginBottom: 8 },
//   actionTile:  { width: (width - 56) / 3, backgroundColor: C.white, borderRadius: 16,
//     padding: 14, alignItems: "center", elevation: 2 },
//   actionTileIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: "center", alignItems: "center", marginBottom: 8 },
//   actionTileLbl:  { fontSize: 11, fontWeight: "700", color: C.text, textAlign: "center" },

//   recentMouCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: C.white, borderRadius: 14,
//     padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", elevation: 1 },
//   recentMouTitle: { fontSize: 14, fontWeight: "700", color: C.navy },
//   recentMouSub:   { fontSize: 12, color: C.textMid, marginTop: 2 },
//   recentMouDate:  { fontSize: 11, color: C.textLight, marginTop: 3 },

//   companyCard: { margin: 16, backgroundColor: C.white, borderRadius: 16, padding: 16,
//     flexDirection: "row", alignItems: "center", justifyContent: "space-between", elevation: 2 },
//   companyCardLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
//   companyLogoBox: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.bg,
//     justifyContent: "center", alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: C.border },
//   companyLogoImg: { width: 52, height: 52, borderRadius: 14 },
//   companyLogoTxt: { fontSize: 18, fontWeight: "900", color: C.navy },
//   companyCardName: { fontSize: 14, fontWeight: "800", color: C.navy },
//   companyCardSub:  { fontSize: 12, color: C.textMid, marginTop: 2 },
//   companyCardAddr: { fontSize: 11, color: C.textLight, marginTop: 2 },
//   editProfileBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#E0F7F7",
//     paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
//   editProfileTxt: { fontSize: 12, color: C.teal, fontWeight: "700" },

//   // ── PROFILE ──
//   profBanner: { backgroundColor: C.navy, paddingTop: Platform.OS === "ios" ? 52 : 42, paddingBottom: 28,
//     alignItems: "center", gap: 8 },
//   profAvatarWrap: { position: "relative", marginBottom: 4 },
//   profAvatarImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: C.gold },
//   profAvatarTxt: { fontSize: 32, fontWeight: "900", color: "#fff", width: 96, height: 96,
//     borderRadius: 48, backgroundColor: C.teal, textAlign: "center", lineHeight: 96,
//     borderWidth: 3, borderColor: C.gold },
//   profCamBtn: { position: "absolute", bottom: 2, right: 2, width: 30, height: 30, borderRadius: 15,
//     backgroundColor: C.gold, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: C.navy },
//   profName: { fontSize: 20, fontWeight: "800", color: "#fff" },
//   verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(13,115,119,0.3)",
//     paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
//   verifiedTxt: { fontSize: 12, color: C.tealLight, fontWeight: "600" },
//   profForm: { padding: 20 },
//   profSection: { fontSize: 14, fontWeight: "800", color: C.navy, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 },
//   fieldWrap:  { marginBottom: 14 },
//   fieldLbl:   { fontSize: 12, fontWeight: "700", color: C.navy, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
//   fieldInput: { backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
//     padding: 13, fontSize: 14, color: C.text, marginTop: 4 },
//   saveBtn:    { backgroundColor: C.navy, padding: 16, borderRadius: 14, alignItems: "center", justifyContent: "center",
//     flexDirection: "row" },
//   saveBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },

//   // ── MOU LIST ──
//   filterRow:  { flexDirection: "row", backgroundColor: C.white, paddingHorizontal: 12, paddingVertical: 10,
//     borderBottomWidth: 1, borderColor: C.border, gap: 8 },
//   filterTab:  { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.bg },
//   filterTabActive: { backgroundColor: C.navy },
//   filterTabTxt:    { fontSize: 12, fontWeight: "600", color: C.textLight },
//   filterTabTxtActive: { color: "#fff" },

//   mouListCard: { backgroundColor: C.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
//   mouListCardUrgent: { borderLeftWidth: 4, borderLeftColor: C.gold },
//   urgentBanner: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#FFF8E6",
//     paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginBottom: 10 },
//   urgentTxt: { fontSize: 11, color: "#92400E", fontWeight: "700" },
//   mouListHead: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
//   mouListTitle: { fontSize: 15, fontWeight: "700", color: C.navy },
//   mouListSub: { fontSize: 12, color: C.textMid, marginTop: 3 },
//   mouListFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
//   mouListDate: { fontSize: 12, color: C.textLight },
//   mtgConfirmedChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#dcfce7",
//     paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
//   mtgConfirmedTxt: { fontSize: 11, color: "#16a34a", fontWeight: "600" },

//   emptyState: { alignItems: "center", paddingVertical: 60 },
//   emptyTitle: { fontSize: 17, fontWeight: "700", color: C.textLight, marginTop: 14 },
//   emptySub:   { fontSize: 13, color: C.textLight, marginTop: 6 },

//   // ── CREATE MOU ──
//   stepRow: { flexDirection: "row", alignItems: "center", justifyContent: "center",
//     paddingVertical: 16, paddingHorizontal: 24, backgroundColor: C.white, borderBottomWidth: 1, borderColor: C.border },
//   stepItem: { flexDirection: "row", alignItems: "center" },
//   stepDot:  { width: 28, height: 28, borderRadius: 14, backgroundColor: C.bg, borderWidth: 2, borderColor: C.border,
//     justifyContent: "center", alignItems: "center" },
//   stepDotActive: { backgroundColor: C.teal, borderColor: C.teal },
//   stepNum: { fontSize: 12, fontWeight: "700", color: C.textLight },
//   stepLbl: { fontSize: 10, color: C.textLight, fontWeight: "600", marginLeft: 6, marginRight: 8 },
//   stepLine: { width: 24, height: 2, backgroundColor: C.border, marginHorizontal: 4 },
//   stepLineActive: { backgroundColor: C.teal },
//   stepHeading: { fontSize: 17, fontWeight: "800", color: C.navy, marginBottom: 20 },
//   createForm: { padding: 20, paddingBottom: 60 },
//   typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 16 },
//   typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
//     borderColor: C.border, backgroundColor: C.white },
//   typeChipActive: { backgroundColor: C.teal, borderColor: C.teal },
//   typeChipTxt: { fontSize: 12, color: C.textMid, fontWeight: "600" },
//   typeChipTxtActive: { color: "#fff" },
//   objNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.navy,
//     justifyContent: "center", alignItems: "center", flexShrink: 0 },
//   objNumTxt: { fontSize: 11, fontWeight: "900", color: "#fff" },
//   addRowBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, marginTop: 4 },
//   addRowTxt: { fontSize: 13, color: C.teal, fontWeight: "700" },
//   reviewCard: { backgroundColor: "#F0FAFA", borderRadius: 14, padding: 16, marginTop: 20, borderWidth: 1, borderColor: C.teal + "33" },
//   reviewTitle: { fontSize: 14, fontWeight: "800", color: C.teal, marginBottom: 12 },
//   reviewRow:   { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8,
//     borderBottomWidth: 1, borderColor: C.border },
//   reviewLbl:   { fontSize: 13, color: C.textMid, fontWeight: "600" },
//   reviewVal:   { fontSize: 13, color: C.navy, fontWeight: "700", maxWidth: "55%", textAlign: "right" },
//   stepBtns: { flexDirection: "row", gap: 12, marginTop: 32 },
//   backStepBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, paddingVertical: 14,
//     borderRadius: 14, borderWidth: 1.5, borderColor: C.teal },
//   backStepTxt: { fontSize: 14, color: C.teal, fontWeight: "700" },
//   nextStepBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
//     backgroundColor: C.navy, padding: 14, borderRadius: 14 },
//   nextStepTxt: { fontSize: 14, color: "#fff", fontWeight: "700" },

//   // ── MOU DETAIL ──
//   statusStrip: { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
//     paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.white,
//     borderBottomWidth: 1, borderColor: C.border, gap: 10 },
//   respBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.teal,
//     paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
//   respBtnTxt: { fontSize: 12, color: "#fff", fontWeight: "700" },
//   tabBar:  { flexDirection: "row", backgroundColor: C.white, borderBottomWidth: 1, borderColor: C.border },
//   tabItem: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
//     gap: 5, paddingVertical: 13 },
//   tabItemActive: { borderBottomWidth: 2.5, borderBottomColor: C.teal },
//   tabTxt:  { fontSize: 12, color: C.textLight, fontWeight: "600" },
//   tabTxtActive: { color: C.teal, fontWeight: "700" },

//   infoCardWrap: { backgroundColor: C.white, borderRadius: 14, padding: 16, marginBottom: 12, elevation: 1 },
//   infoCardHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 10,
//     borderBottomWidth: 1, borderColor: C.border },
//   infoCardTitle: { fontSize: 14, fontWeight: "800", color: C.navy },
//   infoRow:   { flexDirection: "row", justifyContent: "space-between", paddingVertical: 7 },
//   infoRowLbl:{ fontSize: 12, color: C.textLight, fontWeight: "600" },
//   infoRowVal:{ fontSize: 13, color: C.navy, fontWeight: "700", maxWidth: "58%", textAlign: "right" },
//   infoText:  { fontSize: 13, color: C.text, lineHeight: 20 },
//   bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 },
//   bullet:    { width: 6, height: 6, borderRadius: 3, backgroundColor: C.teal, marginTop: 6, flexShrink: 0 },
//   bulletTxt: { fontSize: 13, color: C.text, flex: 1, lineHeight: 20 },

//   changeRow:    { backgroundColor: "#F5F3FF", borderRadius: 10, padding: 12, marginBottom: 8 },
//   changeLbl:    { fontSize: 12, fontWeight: "800", color: C.purple },
//   changeVals:   { fontSize: 13, marginTop: 4 },
//   changeReason: { fontSize: 11, color: C.textLight, marginTop: 4 },

//   stampRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
//   stampDot: { width: 10, height: 10, borderRadius: 5 },
//   stampLbl: { fontSize: 13, fontWeight: "700", color: C.text },
//   stampDate:{ fontSize: 11, color: C.textLight, marginTop: 2 },

//   confirmedCard: { backgroundColor: "#F0FDF4", borderWidth: 1.5, borderColor: "#86EFAC", borderRadius: 16, padding: 18, marginBottom: 14 },
//   confirmedIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#16A34A", justifyContent: "center", alignItems: "center" },
//   confirmedTitle: { fontSize: 16, fontWeight: "800", color: "#166534" },
//   confirmedSince: { fontSize: 11, color: "#6B7280", marginTop: 12 },
//   dtCell: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#BBF7D0" },
//   dtLabel:{ fontSize: 9, color: "#6B7280", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
//   dtVal:  { fontSize: 14, fontWeight: "800", color: "#15803D" },
//   mtgMeta:{ fontSize: 12, color: C.textMid, marginTop: 8 },

//   pendingCard:  { backgroundColor: "#FFFBEB", borderWidth: 1.5, borderColor: "#FDE68A", borderRadius: 16, padding: 16, marginBottom: 14 },
//   pendingTitle: { fontSize: 14, fontWeight: "700", color: "#92400E", marginBottom: 6 },
//   pendingSub:   { fontSize: 12, color: "#A16207", marginBottom: 10 },

//   infoNote: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#EFF6FF",
//     padding: 12, borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: "#BFDBFE" },
//   infoNoteTxt: { fontSize: 12, color: "#0284C7", flex: 1, fontWeight: "500" },

//   slotCard: { backgroundColor: C.white, borderRadius: 14, padding: 14, marginBottom: 10,
//     flexDirection: "row", alignItems: "center", gap: 12, elevation: 1, borderWidth: 1, borderColor: "#BFDBFE" },
//   slotDate: { fontSize: 14, fontWeight: "700", color: C.navy },
//   slotNote: { fontSize: 12, color: C.textMid, marginTop: 3 },
//   selectBtn:{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#16A34A",
//     paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
//   selectTxt:{ fontSize: 12, color: "#fff", fontWeight: "700" },
//   outlineBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1.5, borderColor: C.teal,
//     borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, marginTop: 12, alignSelf: "flex-start" },
//   outlineTxt: { fontSize: 12, color: C.teal, fontWeight: "700" },

//   actSection: { fontSize: 14, fontWeight: "800", color: C.navy, marginBottom: 14 },
//   tlRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
//   tlDot: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", flexShrink: 0 },
//   tlLine:{ display: "none" }, // spacer
//   tlLbl: { fontSize: 13, fontWeight: "600" },
//   tlDate:{ fontSize: 11, color: C.textLight, marginTop: 2 },
//   logCard:{ borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1 },

//   // ── MODALS ──
//   overlay:    { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
//   sheet:      { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
//     maxHeight: "92%", paddingBottom: Platform.OS === "ios" ? 34 : 16 },
//   sheetHandle:{ width: 36, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: "center", marginTop: 10 },
//   sheetHead:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//     padding: 20, borderBottomWidth: 1, borderColor: C.border },
//   sheetTitle: { fontSize: 16, fontWeight: "800", color: C.navy, flex: 1 },
//   sheetFoot:  { flexDirection: "row", gap: 12, padding: 16, borderTopWidth: 1, borderColor: C.border },

//   respTypeBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 14,
//     borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.white, minWidth: "42%" },
//   respTypeTxt: { fontSize: 12, fontWeight: "700", color: C.textLight },
//   changeBlock: { backgroundColor: "#F5F3FF", borderRadius: 12, padding: 12, marginBottom: 10 },

//   optRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//     backgroundColor: "#F0F9FF", borderRadius: 10, padding: 12, marginBottom: 6,
//     borderWidth: 1, borderColor: "#BAE6FD" },
//   optTxt: { fontSize: 13, color: "#0284C7", fontWeight: "600" },

//   // ── LISTS ──
//   listCard:    { backgroundColor: C.white, borderRadius: 14, padding: 16, marginBottom: 10, elevation: 1 },
//   listCardTitle:{ fontSize: 15, fontWeight: "700", color: C.navy },
//   listCardSub:  { fontSize: 12, color: C.textMid, marginTop: 4 },
//   listCardMeta: { fontSize: 12, color: C.textLight },
//   createBtn:   { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
//     backgroundColor: C.navy, padding: 14, borderRadius: 14, marginBottom: 16 },
//   createBtnTxt:{ color: "#fff", fontSize: 15, fontWeight: "700" },
//   formPad:     { padding: 20, paddingBottom: 60 },

//   // ── MESSAGES ──
//   chatItem: { flexDirection: "row", backgroundColor: C.white, borderRadius: 14, marginBottom: 10, padding: 14, gap: 12, elevation: 1 },
//   chatAvatar:{ width: 48, height: 48, borderRadius: 24 },
//   chatName: { fontSize: 14, fontWeight: "700", color: C.navy },
//   chatTime: { fontSize: 11, color: C.textLight },
//   chatSub:  { fontSize: 11, color: C.teal, fontWeight: "600", marginBottom: 3 },
//   chatMsg:  { fontSize: 13, color: C.textLight, flex: 1 },
//   unreadDot:{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.navy, justifyContent: "center", alignItems: "center" },
//   unreadNum:{ fontSize: 10, color: "#fff", fontWeight: "700" },
//   chatHdr:  { flexDirection: "row", alignItems: "center", gap: 12, padding: 16,
//     paddingTop: Platform.OS === "ios" ? 52 : 42, backgroundColor: C.white, elevation: 2, borderBottomWidth: 1, borderColor: C.border },
//   chatHdrAvt: { width: 38, height: 38, borderRadius: 19 },
//   chatHdrName:{ fontSize: 15, fontWeight: "700", color: C.navy },
//   bubble:   { padding: 12, borderRadius: 18, maxWidth: "80%", marginBottom: 10 },
//   bubbleMe: { alignSelf: "flex-end", backgroundColor: C.navy, borderBottomRightRadius: 4 },
//   bubbleThem:{ alignSelf: "flex-start", backgroundColor: "#E5E7EB", borderBottomLeftRadius: 4 },
//   botIcon:  { width: 22, height: 22, borderRadius: 11, backgroundColor: C.teal,
//     justifyContent: "center", alignItems: "center", marginBottom: 6 },
//   inputRow: { flexDirection: "row", padding: 12, backgroundColor: C.white,
//     borderTopWidth: 1, borderColor: C.border, alignItems: "center", gap: 10 },
//   chatInput:{ flex: 1, backgroundColor: C.bg, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
//   sendBtn:  { width: 44, height: 44, borderRadius: 22, backgroundColor: C.navy, justifyContent: "center", alignItems: "center" },

//   // ── DRAWER ──
//   drawerTop: { backgroundColor: C.navy, paddingTop: Platform.OS === "ios" ? 58 : 46,
//     paddingHorizontal: 20, paddingBottom: 24 },
//   drawerLogoBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.teal,
//     justifyContent: "center", alignItems: "center" },
//   drawerLogoTxt: { fontSize: 13, fontWeight: "900", color: "#fff" },
//   drawerBrandTxt:{ fontSize: 18, fontWeight: "800", color: "#fff" },
//   drawerClose: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.1)",
//     justifyContent: "center", alignItems: "center" },
//   drawerProfileRow: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.08)",
//     borderRadius: 16, padding: 12 },
//   drawerAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.teal,
//     justifyContent: "center", alignItems: "center", overflow: "hidden",
//     borderWidth: 2, borderColor: "rgba(255,255,255,0.25)" },
//   drawerAvatarImg: { width: 52, height: 52, borderRadius: 26 },
//   drawerAvatarTxt: { fontSize: 18, fontWeight: "900", color: "#fff" },
//   drawerUserName:  { fontSize: 15, fontWeight: "800", color: "#fff" },
//   drawerUserSub:   { fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 },
//   drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10,
//     borderRadius: 14, marginBottom: 4, gap: 12 },
//   drawerItemActive: { backgroundColor: C.navy + "0D" },
//   drawerItemIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center" },
//   drawerItemTxt:  { flex: 1, fontSize: 14, fontWeight: "600", color: C.textMid },
//   drawerActiveDot:{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.teal },
//   drawerFooter:   { padding: 20, paddingTop: 10, borderTopWidth: 1, borderColor: C.border, margin: 12, marginTop: 20, borderRadius: 12 },
//   drawerFooterTxt:{ fontSize: 12, fontWeight: "700", color: C.textMid },
//   drawerFooterSub:{ fontSize: 11, color: C.textLight, marginTop: 2 },
// });




// import { Ionicons } from "@expo/vector-icons";
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
// } from "@react-navigation/drawer";
// import { useNavigation } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import * as ImagePicker from "expo-image-picker";
// import React, {
//   createContext, useCallback, useContext,
//   useEffect, useRef, useState
// } from "react";
// import {
//   ActivityIndicator, Alert, Animated, Dimensions,
//   FlatList, Image, KeyboardAvoidingView,
//   Modal, Platform, RefreshControl, ScrollView,
//   StatusBar, StyleSheet, Text, TextInput,
//   TouchableOpacity, View
// } from "react-native";
// import axios from "axios";

// const { width, height } = Dimensions.get("window");

// // ─── THEME ──────────────────────────────────────────────────────
// const C = {
//   navy:       "#0F2236",
//   navyDark:   "#08151F",
//   navyMid:    "#193648",
//   teal:       "#0D7377",
//   tealLight:  "#14BDBD",
//   gold:       "#C9A84C",
//   goldLight:  "#F0C96A",
//   offWhite:   "#F5F7FA",
//   white:      "#FFFFFF",
//   text:       "#1A2332",
//   textMid:    "#4A5568",
//   textLight:  "#8A96A3",
//   border:     "#E2EAF0",
//   success:    "#10B981",
//   danger:     "#EF4444",
//   warning:    "#F59E0B",
//   purple:     "#7C3AED",
//   card:       "#FFFFFF",
//   bg:         "#EEF3F8",
// };

// // ─── API ────────────────────────────────────────────────────────
// const BASE = "http://192.168.0.245:5000";
// const API_MOU  = `${BASE}/api/industry/mous`;
// const API_INT  = `${BASE}/api/industry/internships`;
// const API_PROJ = `${BASE}/api/industry/projects`;

// // ─── STATUS CONFIG ───────────────────────────────────────────────
// const SC = {
//   Draft:                    { c: "#64748b", bg: "#f1f5f9",  lbl: "Draft" },
//   "Sent to Industry":       { c: "#d97706", bg: "#fffbeb",  lbl: "Sent to Us" },
//   "Changes Proposed":       { c: "#7c3aed", bg: "#f5f3ff",  lbl: "Changes Proposed" },
//   "Industry Responded":     { c: "#0891b2", bg: "#ecfeff",  lbl: "Responded" },
//   "Approved by Industry":   { c: "#059669", bg: "#ecfdf5",  lbl: "We Approved ✓" },
//   "Approved by University": { c: "#0284c7", bg: "#e0f2fe",  lbl: "Uni Approved" },
//   "Mutually Approved":      { c: "#16a34a", bg: "#dcfce7",  lbl: "Mutually Approved ✓" },
//   Rejected:                 { c: "#dc2626", bg: "#fef2f2",  lbl: "Rejected" },
// };

// const CT = {
//   industry_change:    { c: "#7c3aed", bg: "#f5f3ff", ic: "🏭", lbl: "Industry Changed" },
//   industry_approve:   { c: "#059669", bg: "#ecfdf5", ic: "✅", lbl: "Industry Approved" },
//   industry_reject:    { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Industry Rejected" },
//   industry_response:  { c: "#0891b2", bg: "#ecfeff", ic: "💬", lbl: "Industry Response" },
//   university_change:  { c: "#0284c7", bg: "#e0f2fe", ic: "🎓", lbl: "University Changed" },
//   university_approve: { c: "#16a34a", bg: "#dcfce7", ic: "✅", lbl: "Uni Approved" },
//   university_reject:  { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Uni Rejected" },
//   meeting_proposed:   { c: "#7c3aed", bg: "#f5f3ff", ic: "📅", lbl: "Meeting Proposed" },
//   meeting_confirmed:  { c: "#16a34a", bg: "#dcfce7", ic: "🤝", lbl: "Meeting Confirmed" },
// };

// // ─── HELPERS ─────────────────────────────────────────────────────
// const fmtDate = (d) => {
//   if (!d) return "—";
//   try { return new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }); }
//   catch { return d; }
// };
// const fmtDT = (d) => {
//   if (!d) return "—";
//   try { return new Date(d).toLocaleString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
//   catch { return d; }
// };
// const addCL = (m, type, data = {}) =>
//   [...(m.changeLog || []), { id: Date.now(), type, date: new Date().toISOString(), ...data }];

// const bldPayload = (m) => ({
//   title: m.title, university: m.university, industry: m.industry,
//   collaborationType: m.collaborationType, startDate: m.startDate, endDate: m.endDate,
//   description: m.description, objectives: m.objectives || [],
//   responsibilities: m.responsibilities, terms: m.terms || [],
//   signatories: m.signatories, universityContact: m.universityContact,
//   industryContact: m.industryContact, universityLogo: m.universityLogo || "",
//   industryLogo: m.industryLogo || "", status: m.status,
//   universityStamp: m.universityStamp, industryStamp: m.industryStamp,
//   sentAt: m.sentAt, industryResponseAt: m.industryResponseAt,
//   proposedChanges: m.proposedChanges || [], changeLog: m.changeLog || [],
//   scheduledMeeting: m.scheduledMeeting || null,
// });

// // ─── USER CONTEXT ────────────────────────────────────────────────
// const UserCtx = createContext(null);
// const useUser = () => useContext(UserCtx);

// const DEFAULT_USER = {
//   _id: "industry_001",
//   name: "Edit Industry Name",
//   email: "hr@techsolutions.com",
//   industry: "Information Technology",
//   phone: "+",
//   website: "Edit Industry URL",
//   address: "",
//   about: "Edit About",
//   logo: "",
// };

// const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(DEFAULT_USER);
//   const ax = useCallback(() => axios.create({ timeout: 10000 }), []);
//   const updateUser = (data) => setUser((p) => ({ ...p, ...data }));
//   return <UserCtx.Provider value={{ user, updateUser, ax }}>{children}</UserCtx.Provider>;
// };

// // ─── TOAST ───────────────────────────────────────────────────────
// const ToastCtx = createContext(null);
// const useToast = () => useContext(ToastCtx);

// const ToastProvider = ({ children }) => {
//   const [t, setT] = useState(null);
//   const anim = useRef(new Animated.Value(0)).current;
//   const show = (msg, type = "info") => {
//     setT({ msg, type });
//     Animated.sequence([
//       Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
//       Animated.delay(2600),
//       Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
//     ]).start(() => setT(null));
//   };
//   const colors = { success: ["#d1fae5", "#059669"], error: ["#fee2e2", "#dc2626"], info: ["#dbeafe", "#2563eb"] };
//   const [bg, fg] = (colors)[t?.type || "info"] || colors.info;
//   return (
//     <ToastCtx.Provider value={show}>
//       {children}
//       {t && (
//         <Animated.View style={[styles.toast, { backgroundColor: bg, borderColor: fg + "66",
//           opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
//           <Ionicons name={t.type === "success" ? "checkmark-circle" : t.type === "error" ? "close-circle" : "information-circle"} size={18} color={fg} />
//           <Text style={[styles.toastTxt, { color: fg }]}>{t.msg}</Text>
//         </Animated.View>
//       )}
//     </ToastCtx.Provider>
//   );
// };

// // ─── STATUS BADGE ────────────────────────────────────────────────
// const SBadge = ({ status }) => {
//   const s = SC[status] || { c: C.textLight, bg: C.bg, lbl: status };
//   return (
//     <View style={[styles.badge, { backgroundColor: s.bg }]}>
//       <Text style={[styles.badgeTxt, { color: s.c }]}>{s.lbl}</Text>
//     </View>
//   );
// };

// // ─── HEADER ──────────────────────────────────────────────────────
// const Header = ({ title, back = false, right }) => {
//   const nav = useNavigation();
//   return (
//     <View style={styles.hdr}>
//       <TouchableOpacity onPress={() => back ? nav.goBack() : nav.openDrawer()} style={styles.hdrBtn}>
//         <Ionicons name={back ? "arrow-back" : "menu-outline"} size={24} color={C.navy} />
//       </TouchableOpacity>
//       <Text style={styles.hdrTitle} numberOfLines={1}>{title}</Text>
//       {right ? right : <View style={{ width: 40 }} />}
//     </View>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// //  DASHBOARD
// // ═══════════════════════════════════════════════════════════════
// function DashboardScreen() {
//   const nav = useNavigation();
//   const { user, ax } = useUser();
//   const [counts, setCounts] = useState({ mous: 0, internships: 0, projects: 0, pending: 0 });
//   const [recentMous, setRecentMous] = useState([]);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
//     const a = ax();
//     Promise.all([
//       a.get(`${API_MOU}/mine`, { params: { industryId: user?._id, industry: user?.name } }).catch(() => ({ data: [] })),
//       a.get(API_INT).catch(() => ({ data: [] })),
//       a.get(API_PROJ).catch(() => ({ data: [] })),
//     ]).then(([m, i, p]) => {
//       const mous = m.data || [];
//       const pending = mous.filter((x) => ["Sent to Industry", "Changes Proposed"].includes(x.status)).length;
//       setCounts({ mous: mous.length, internships: (i.data || []).length, projects: (p.data || []).length, pending });
//       setRecentMous(mous.slice(0, 3));
//     });
//   }, []);

//   const initials = (name) => name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "CX";

//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <StatusBar barStyle="light-content" backgroundColor={C.navy} />

//       {/* Top Banner */}
//       <View style={styles.dashBanner}>
//         <View style={styles.dashBannerContent}>
//           <TouchableOpacity onPress={() => nav.openDrawer()} style={styles.dashMenuBtn}>
//             <Ionicons name="menu" size={26} color={C.white} />
//           </TouchableOpacity>
//           <View style={{ flex: 1, marginLeft: 12 }}>
//             <Text style={styles.dashGreet}>Good day,</Text>
//             <Text style={styles.dashName} numberOfLines={1}>{user?.name || "Partner"}</Text>
//           </View>
//           <TouchableOpacity onPress={() => nav.navigate("Profile")} style={styles.dashAvatar}>
//             {user?.logo
//               ? <Image source={{ uri: user.logo }} style={styles.dashAvatarImg} />
//               : <Text style={styles.dashAvatarTxt}>{initials(user?.name || "CX")}</Text>}
//             <View style={styles.dashAvatarDot} />
//           </TouchableOpacity>
//         </View>

//         {/* Stats Row */}
//         <View style={styles.statsRow}>
//           {[
//             { n: counts.mous,         lbl: "MOUs",        icon: "document-text" },
//             { n: counts.internships,  lbl: "Internships", icon: "briefcase" },
//             { n: counts.projects,     lbl: "Projects",    icon: "flask" },
//             { n: counts.pending,      lbl: "Pending",     icon: "time", warn: true },
//           ].map((s, i) => (
//             <View key={i} style={styles.statPill}>
//               <Text style={[styles.statN, s.warn && counts.pending > 0 && { color: C.goldLight }]}>{s.n}</Text>
//               <Text style={styles.statLbl}>{s.lbl}</Text>
//             </View>
//           ))}
//         </View>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
//         <Animated.View style={{ opacity: fadeAnim }}>

//           {/* Pending Alert */}
//           {counts.pending > 0 && (
//             <TouchableOpacity onPress={() => nav.navigate("MoUs")} style={styles.alertBanner}>
//               <View style={styles.alertDot} />
//               <Text style={styles.alertTxt}>
//                 {counts.pending} MOU{counts.pending > 1 ? "s" : ""} awaiting your response
//               </Text>
//               <Ionicons name="chevron-forward" size={16} color={C.gold} />
//             </TouchableOpacity>
//           )}

//           {/* Quick Actions */}
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Quick Actions</Text>
//           </View>
//           <View style={styles.actionsGrid}>
//             {[
//               { icon: "document-text", label: "MOU\nManagement", screen: "MoUs", color: C.teal, bg: "#E0F7F7" },
//               { icon: "briefcase",     label: "Post\nInternship", screen: "InternshipsMain", color: "#7C3AED", bg: "#F3F0FF" },
//               { icon: "flask",         label: "Add\nProject",     screen: "ManageProjects", color: "#0284C7", bg: "#E0F2FE" },
//               { icon: "chatbubbles",   label: "Messages",         screen: "MessagesMain", color: "#D97706", bg: "#FEF3C7" },
//               { icon: "sparkles",      label: "CXbot\nAI",        screen: "AIChatbot", color: C.navy, bg: C.border },
//               { icon: "person",        label: "Profile",          screen: "Profile", color: "#059669", bg: "#D1FAE5" },
//             ].map((a, i) => (
//               <TouchableOpacity key={i} style={styles.actionTile} onPress={() => nav.navigate(a.screen)} activeOpacity={0.82}>
//                 <View style={[styles.actionTileIcon, { backgroundColor: a.bg }]}>
//                   <Ionicons name={a.icon} size={26} color={a.color} />
//                 </View>
//                 <Text style={styles.actionTileLbl}>{a.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Recent MOUs */}
//           {recentMous.length > 0 && (
//             <>
//               <View style={[styles.sectionHeader, { marginTop: 8 }]}>
//                 <Text style={styles.sectionTitle}>Recent MOUs</Text>
//                 <TouchableOpacity onPress={() => nav.navigate("MoUs")}>
//                   <Text style={styles.seeAll}>See all</Text>
//                 </TouchableOpacity>
//               </View>
//               {recentMous.map((m) => (
//                 <TouchableOpacity key={m._id} style={styles.recentMouCard}
//                   onPress={() => nav.navigate("MouDetail", { mouId: m._id })} activeOpacity={0.85}>
//                   <View style={styles.recentMouLeft}>
//                     <Text style={styles.recentMouTitle} numberOfLines={1}>{m.title || m.university}</Text>
//                     <Text style={styles.recentMouSub} numberOfLines={1}>{m.collaborationType}</Text>
//                     <Text style={styles.recentMouDate}>{fmtDate(m.endDate)}</Text>
//                   </View>
//                   <SBadge status={m.status} />
//                 </TouchableOpacity>
//               ))}
//             </>
//           )}

//           {/* Company Card */}
//           <View style={styles.companyCard}>
//             <View style={styles.companyCardLeft}>
//               <View style={styles.companyLogoBox}>
//                 {user?.logo
//                   ? <Image source={{ uri: user.logo }} style={styles.companyLogoImg} />
//                   : <Text style={styles.companyLogoTxt}>{initials(user?.name || "CX")}</Text>}
//               </View>
//               <View>
//                 <Text style={styles.companyCardName}>{user?.name}</Text>
//                 <Text style={styles.companyCardSub}>{user?.industry}</Text>
//                 {user?.address && <Text style={styles.companyCardAddr}>📍 {user.address}</Text>}
//               </View>
//             </View>
//             <TouchableOpacity onPress={() => nav.navigate("Profile")} style={styles.editProfileBtn}>
//               <Ionicons name="pencil" size={14} color={C.teal} />
//               <Text style={styles.editProfileTxt}>Edit</Text>
//             </TouchableOpacity>
//           </View>

//         </Animated.View>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  PROFILE SCREEN
// //  FIX: "back" prop hata diya — drawer screen hai, stack nahi
// //  FIX: Custom back button jo Dashboard pe le jaata hai
// // ═══════════════════════════════════════════════════════════════
// function ProfileScreen() {
//   const nav = useNavigation();
//   const { user, updateUser, ax } = useUser();
//   const toast = useToast();
//   const [ld, setLd] = useState(false);
//   const [form, setForm] = useState({ ...user });

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") { Alert.alert("Permission needed", "Camera roll access required."); return; }
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true, aspect: [1, 1], quality: 0.8,
//     });
//     if (!res.canceled) {
//       const newLogo = res.assets[0].uri;
//       setForm((f) => ({ ...f, logo: newLogo }));
//       updateUser({ logo: newLogo });
//     }
//   };

//   const save = async () => {
//     setLd(true);
//     try {
//       try { await ax().put(`${BASE}/api/industry/auth/profile`, form); } catch {}
//       updateUser(form);
//       toast("Profile updated!", "success");
//     } catch { toast("Update failed", "error"); }
//     finally { setLd(false); }
//   };

//   const initials = (n) => n?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "CX";

//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       {/* FIX: Custom header with drawer-aware back button */}
//       <View style={styles.hdr}>
//         <TouchableOpacity onPress={() => nav.navigate("Dashboard")} style={styles.hdrBtn}>
//           <Ionicons name="arrow-back" size={24} color={C.navy} />
//         </TouchableOpacity>
//         <Text style={styles.hdrTitle} numberOfLines={1}>Company Profile</Text>
//         <View style={{ width: 40 }} />
//       </View>

//       <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
//         {/* Profile Header */}
//         <View style={styles.profBanner}>
//           <TouchableOpacity onPress={pickImage} style={styles.profAvatarWrap}>
//             {form.logo
//               ? <Image source={{ uri: form.logo }} style={styles.profAvatarImg} />
//               : <Text style={styles.profAvatarTxt}>{initials(form.name)}</Text>}
//             <View style={styles.profCamBtn}>
//               <Ionicons name="camera" size={14} color="#fff" />
//             </View>
//           </TouchableOpacity>
//           <Text style={styles.profName}>{form.name}</Text>
//           <View style={styles.verifiedBadge}>
//             <Ionicons name="shield-checkmark" size={12} color={C.teal} />
//             <Text style={styles.verifiedTxt}>Verified Partner</Text>
//           </View>
//         </View>

//         <View style={styles.profForm}>
//           <Text style={styles.profSection}>Company Info</Text>
//           {[
//             { lbl: "Company Name", key: "name" },
//             { lbl: "Industry Sector", key: "industry" },
//             { lbl: "Website", key: "website", kbType: "url" },
//             { lbl: "Address", key: "address" },
//           ].map(f => (
//             <View key={f.key} style={styles.fieldWrap}>
//               <Text style={styles.fieldLbl}>{f.lbl}</Text>
//               <TextInput style={styles.fieldInput} value={(form)[f.key]}
//                 onChangeText={(v) => setForm((x) => ({ ...x, [f.key]: v }))}
//                 keyboardType={(f).kbType || "default"} />
//             </View>
//           ))}
//           <View style={styles.fieldWrap}>
//             <Text style={styles.fieldLbl}>About Us</Text>
//             <TextInput style={[styles.fieldInput, { height: 90, textAlignVertical: "top" }]}
//               value={form.about} onChangeText={(v) => setForm((x) => ({ ...x, about: v }))} multiline />
//           </View>

//           <Text style={[styles.profSection, { marginTop: 20 }]}>Contact</Text>
//           {[
//             { lbl: "Email", key: "email", kbType: "email-address" },
//             { lbl: "Phone", key: "phone", kbType: "phone-pad" },
//           ].map(f => (
//             <View key={f.key} style={styles.fieldWrap}>
//               <Text style={styles.fieldLbl}>{f.lbl}</Text>
//               <TextInput style={styles.fieldInput} value={(form)[f.key]}
//                 onChangeText={(v) => setForm((x) => ({ ...x, [f.key]: v }))}
//                 keyboardType={(f).kbType || "default"} autoCapitalize="none" />
//             </View>
//           ))}

//           <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={ld}>
//             {ld ? <ActivityIndicator color="#fff" /> : (
//               <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//                 <Ionicons name="checkmark-circle" size={18} color="#fff" />
//                 <Text style={styles.saveBtnTxt}>Save Changes</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MOU LIST
// //  FIX: industryId aur industry params ab backend ko bheje ja rahe hain
// // ═══════════════════════════════════════════════════════════════
// function MoUScreen() {
//   const nav = useNavigation();
//   // FIX: user add kiya taake industryId/name bhej sakein
//   const { ax, user } = useUser();
//   const [mous, setMous] = useState([]);
//   const [ld, setLd] = useState(true);
//   const [ref, setRef] = useState(false);
//   const [filter, setFilter] = useState("All");

//   const load = useCallback(async (show = true) => {
//     if (show) setLd(true);
//     try {
//       // FIX: params bhejo taake sirf apni company ke MOUs aayein
//       const r = await ax().get(`${API_MOU}/mine`, {
//         params: {
//           industryId: user?._id,
//           industry: user?.name
//         }
//       });
//       setMous(r.data || []);
//     }
//     catch (e) {
//       console.log("MOU load error:", e?.response?.data || e.message);
//     }
//     finally { setLd(false); setRef(false); }
//   }, [ax, user]);

//   useEffect(() => { load(); }, []);

//   const filtered = filter === "All" ? mous :
//     mous.filter(m => filter === "Pending" ? ["Sent to Industry", "Changes Proposed"].includes(m.status) :
//       filter === "Approved" ? m.status === "Mutually Approved" : m.status === filter);

//   const tabs = ["All", "Pending", "Approved", "Rejected"];

//   if (ld) return <View style={styles.center}><ActivityIndicator color={C.teal} size="large" /></View>;

//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="MOU Management"
//         right={
//           <TouchableOpacity onPress={() => nav.navigate("CreateMoU")} style={styles.hdrAction}>
//             <Ionicons name="add" size={22} color={C.white} />
//           </TouchableOpacity>
//         }
//         back
//       />

//       {/* Filter Tabs */}
//       <View style={styles.filterRow}>
//         {tabs.map(t => (
//           <TouchableOpacity key={t} onPress={() => setFilter(t)}
//             style={[styles.filterTab, filter === t && styles.filterTabActive]}>
//             <Text style={[styles.filterTabTxt, filter === t && styles.filterTabTxtActive]}>{t}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <FlatList
//         data={filtered}
//         keyExtractor={m => m._id}
//         contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
//         refreshControl={<RefreshControl refreshing={ref} onRefresh={() => { setRef(true); load(false); }} tintColor={C.teal} />}
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Ionicons name="document-text-outline" size={56} color={C.textLight} />
//             <Text style={styles.emptyTitle}>No MOUs yet</Text>
//             <Text style={styles.emptySub}>Tap + to request a new MOU</Text>
//           </View>
//         }
//         renderItem={({ item: m }) => {
//           const needsAction = ["Sent to Industry", "Changes Proposed"].includes(m.status);
//           return (
//             <TouchableOpacity
//               style={[styles.mouListCard, needsAction && styles.mouListCardUrgent]}
//               onPress={() => nav.navigate("MouDetail", { mouId: m._id })}
//               activeOpacity={0.85}>
//               {needsAction && (
//                 <View style={styles.urgentBanner}>
//                   <Ionicons name="flash" size={11} color={C.gold} />
//                   <Text style={styles.urgentTxt}>Action Required</Text>
//                 </View>
//               )}
//               {m.status === "Mutually Approved" && (
//                 <View style={[styles.urgentBanner, { backgroundColor: "#dcfce7" }]}>
//                   <Ionicons name="checkmark-circle" size={11} color="#16a34a" />
//                   <Text style={[styles.urgentTxt, { color: "#16a34a" }]}>Mutually Approved</Text>
//                 </View>
//               )}
//               <View style={styles.mouListHead}>
//                 <View style={{ flex: 1, marginRight: 10 }}>
//                   <Text style={styles.mouListTitle} numberOfLines={1}>{m.title || m.university}</Text>
//                   <Text style={styles.mouListSub}>{m.university} · {m.collaborationType}</Text>
//                 </View>
//                 <SBadge status={m.status} />
//               </View>
//               <View style={styles.mouListFooter}>
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
//                   <Ionicons name="calendar-outline" size={12} color={C.textLight} />
//                   <Text style={styles.mouListDate}>{fmtDate(m.startDate)} → {fmtDate(m.endDate)}</Text>
//                 </View>
//                 {(m.scheduledMeeting?.confirmedSlot?.date || m.meetingConfirmedSlot?.date) && (
//                   <View style={styles.mtgConfirmedChip}>
//                     <Ionicons name="checkmark-circle" size={10} color="#16a34a" />
//                     <Text style={styles.mtgConfirmedTxt}>Meeting set</Text>
//                   </View>
//                 )}
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//       />
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  CREATE MOU
// // ═══════════════════════════════════════════════════════════════
// function CreateMoUScreen() {
//   const nav = useNavigation();
//   const { user, ax } = useUser();
//   const toast = useToast();
//   const [ld, setLd] = useState(false);
//   const [step, setStep] = useState(1);
//   const [form, setForm] = useState({
//     title: "", collaborationType: "", description: "",
//     objectives: [""], terms: [""],
//     startDate: "", endDate: "",
//     signatories: { industry: "" },
//     industryContact: { name: "", designation: "", email: "" },
//   });

//   const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
//   const arrAdd = (k) => setForm((f) => ({ ...f, [k]: [...f[k], ""] }));
//   const arrUpd = (k, i, v) => setForm((f) => { const a = [...f[k]]; a[i] = v; return { ...f, [k]: a }; });

//   const submit = async () => {
//     if (!form.title || !form.collaborationType) {
//       Alert.alert("Missing Information", "Please enter Title and Collaboration Type.");
//       return;
//     }

//     setLd(true);
//     try {
//       const payload = {
//         title: form.title,
//         university: "Riphah International University",
//         industry: user?.name || "New Industry Partner",
//         industryId: user?._id || "industry_001",
//         collaborationType: form.collaborationType,
//         description: form.description || "",
//         startDate: form.startDate || new Date().toISOString().split('T')[0],
//         endDate: form.endDate || new Date(Date.now() + 31536000000).toISOString().split('T')[0],
//         objectives: form.objectives.filter(Boolean),
//         terms: form.terms.filter(Boolean),
//         industryContact: form.industryContact,
//         signatories: form.signatories,
//         status: "Draft",
//         changeLog: [{
//           id: Date.now(),
//           type: "industry_change",
//           date: new Date().toISOString(),
//           party: "Industry",
//           message: `MOU Request created by ${user?.name}`
//         }]
//       };

//       const response = await ax().post(API_MOU, payload);

//       if (response.status === 201 || response.status === 200) {
//         toast("MOU request sent successfully!", "success");
//         nav.goBack();
//       }
//     } catch (e) {
//       console.log("Full Error Object:", e.response?.data);
//       const errorMsg = e.response?.data?.message || "Server connection failed. Check your IP address.";
//       Alert.alert("Creation Failed", errorMsg);
//     } finally {
//       setLd(false);
//     }
//   };

//   const TYPES = ["Research", "Internship", "Training", "Consultancy", "Joint Venture", "Other"];

//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="Request New MOU" back />

//       {/* Step Indicator */}
//       <View style={styles.stepRow}>
//         {[1, 2, 3].map(s => (
//           <View key={s} style={styles.stepItem}>
//             <View style={[styles.stepDot, step >= s && styles.stepDotActive]}>
//               {step > s ? <Ionicons name="checkmark" size={12} color="#fff" /> :
//                 <Text style={[styles.stepNum, step >= s && { color: "#fff" }]}>{s}</Text>}
//             </View>
//             <Text style={[styles.stepLbl, step >= s && { color: C.teal }]}>
//               {s === 1 ? "Basics" : s === 2 ? "Details" : "Review"}
//             </Text>
//             {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
//           </View>
//         ))}
//       </View>

//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.createForm}>

//           {step === 1 && (
//             <>
//               <Text style={styles.stepHeading}>Basic Information</Text>
//               <FieldInput label="MOU Title *" value={form.title} onChange={v => set("title", v)} placeholder="e.g. AI Research Collaboration" />
//               <FieldInput label="University" value="Riphah International University" onChange={() => {}} editable={false} />

//               <Text style={styles.fieldLbl}>Collaboration Type *</Text>
//               <View style={styles.typeGrid}>
//                 {TYPES.map(t => (
//                   <TouchableOpacity key={t} onPress={() => set("collaborationType", t)}
//                     style={[styles.typeChip, form.collaborationType === t && styles.typeChipActive]}>
//                     <Text style={[styles.typeChipTxt, form.collaborationType === t && styles.typeChipTxtActive]}>{t}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <FieldInput label="Start Date" value={form.startDate} onChange={v => set("startDate", v)} placeholder="YYYY-MM-DD" />
//               <FieldInput label="End Date" value={form.endDate} onChange={v => set("endDate", v)} placeholder="YYYY-MM-DD" />
//             </>
//           )}

//           {step === 2 && (
//             <>
//               <Text style={styles.stepHeading}>Purpose & Objectives</Text>
//               <FieldInput label="Description / Purpose *" value={form.description} onChange={v => set("description", v)}
//                 placeholder="Describe the purpose and scope..." multiline />

//               <Text style={styles.fieldLbl}>Objectives</Text>
//               {form.objectives.map((o, i) => (
//                 <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
//                   <View style={styles.objNum}><Text style={styles.objNumTxt}>{i + 1}</Text></View>
//                   <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} value={o}
//                     onChangeText={(v) => arrUpd("objectives", i, v)} placeholder={`Objective ${i + 1}`} />
//                 </View>
//               ))}
//               <TouchableOpacity onPress={() => arrAdd("objectives")} style={styles.addRowBtn}>
//                 <Ionicons name="add-circle-outline" size={16} color={C.teal} />
//                 <Text style={styles.addRowTxt}>Add Objective</Text>
//               </TouchableOpacity>

//               <Text style={[styles.fieldLbl, { marginTop: 16 }]}>Terms & Conditions</Text>
//               {form.terms.map((t, i) => (
//                 <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
//                   <View style={styles.objNum}><Text style={styles.objNumTxt}>{i + 1}</Text></View>
//                   <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} value={t}
//                     onChangeText={(v) => arrUpd("terms", i, v)} placeholder={`Term ${i + 1}`} />
//                 </View>
//               ))}
//               <TouchableOpacity onPress={() => arrAdd("terms")} style={styles.addRowBtn}>
//                 <Ionicons name="add-circle-outline" size={16} color={C.teal} />
//                 <Text style={styles.addRowTxt}>Add Term</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {step === 3 && (
//             <>
//               <Text style={styles.stepHeading}>Contact & Review</Text>
//               <FieldInput label="Your Contact Name" value={form.industryContact.name}
//                 onChange={v => set("industryContact", { ...form.industryContact, name: v })} />
//               <FieldInput label="Designation" value={form.industryContact.designation}
//                 onChange={v => set("industryContact", { ...form.industryContact, designation: v })} />
//               <FieldInput label="Contact Email" value={form.industryContact.email}
//                 onChange={v => set("industryContact", { ...form.industryContact, email: v })} kbType="email-address" />
//               <FieldInput label="Authorized Signatory" value={form.signatories.industry}
//                 onChange={v => set("signatories", { ...form.signatories, industry: v })} placeholder="Name & Designation" />

//               {/* Summary */}
//               <View style={styles.reviewCard}>
//                 <Text style={styles.reviewTitle}>Summary</Text>
//                 {[
//                   { l: "Title",      v: form.title },
//                   { l: "Type",       v: form.collaborationType },
//                   { l: "Duration",   v: `${form.startDate || "—"} → ${form.endDate || "—"}` },
//                   { l: "University", v: "Riphah International University" },
//                   { l: "Industry",   v: user?.name },
//                 ].map(r => (
//                   <View key={r.l} style={styles.reviewRow}>
//                     <Text style={styles.reviewLbl}>{r.l}</Text>
//                     <Text style={styles.reviewVal}>{r.v || "—"}</Text>
//                   </View>
//                 ))}
//               </View>
//             </>
//           )}

//           <View style={styles.stepBtns}>
//             {step > 1 && (
//               <TouchableOpacity style={styles.backStepBtn} onPress={() => setStep(s => s - 1)}>
//                 <Ionicons name="arrow-back" size={16} color={C.teal} />
//                 <Text style={styles.backStepTxt}>Back</Text>
//               </TouchableOpacity>
//             )}
//             {step < 3 ? (
//               <TouchableOpacity style={[styles.nextStepBtn, { flex: 1 }]} onPress={() => setStep(s => s + 1)}>
//                 <Text style={styles.nextStepTxt}>Continue</Text>
//                 <Ionicons name="arrow-forward" size={16} color="#fff" />
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity style={[styles.nextStepBtn, { flex: 1, backgroundColor: C.teal }]} onPress={submit} disabled={ld}>
//                 {ld ? <ActivityIndicator color="#fff" size="small" /> : (
//                   <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//                     <Ionicons name="send" size={16} color="#fff" />
//                     <Text style={styles.nextStepTxt}>Submit Request</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MOU DETAIL
// // ═══════════════════════════════════════════════════════════════
// function MouDetailScreen({ route }) {
//   const { ax } = useUser();
//   const toast = useToast();
//   const [mou, setMou] = useState(null);
//   const [ld, setLd] = useState(true);
//   const [actLd, setActLd] = useState(false);
//   const [tab, setTab] = useState("details");
//   const [respModal, setRespModal] = useState(false);
//   const [mtgModal, setMtgModal] = useState(false);
//   const mouId = route.params?.mouId;

//   useEffect(() => {
//     ax().get(`${API_MOU}/${mouId}`)
//       .then(r => setMou(r.data))
//       .catch(() => {})
//       .finally(() => setLd(false));
//   }, [mouId]);

//   const upd = (u) => setMou(u);

//   const doResponse = async (rd) => {
//     setActLd(true);
//     try {
//       const lt = rd.type === "accept" ? "industry_approve" : rd.type === "reject" ? "industry_reject" :
//         rd.type === "change" ? "industry_change" : "industry_response";
//       const cl = addCL(mou, lt, { party: "Industry", from: mou.industry, message: rd.message });
//       let ns = mou.status;
//       if (rd.type === "accept") ns = "Approved by Industry";
//       else if (rd.type === "reject") ns = "Rejected";
//       else if (rd.type === "change") ns = "Changes Proposed";
//       else ns = "Industry Responded";
//       const stamp = rd.type === "accept" ? { by: mou.industry, type: "approve", date: new Date().toISOString() } : mou.industryStamp;
//       const pl = { ...bldPayload(mou), status: ns, changeLog: cl, industryStamp: stamp,
//         industryResponseAt: new Date().toISOString(),
//         proposedChanges: rd.changes ? [...(mou.proposedChanges || []), ...rd.changes] : (mou.proposedChanges || []) };
//       const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
//       upd(r.data); setRespModal(false);
//       toast(rd.type === "accept" ? "🎉 MOU Approved!" : rd.type === "reject" ? "MOU Rejected" : "Response sent!",
//         rd.type === "reject" ? "error" : "success");
//     } catch (e) {
//       const detailedError = JSON.stringify(e.response?.data) || e.message;
//       console.log("Error Details:", detailedError);
//       Alert.alert("Server Error", detailedError);
//       toast("Action failed", "error");
//     }
//     finally { setActLd(false); }
//   };

//   const selectSlot = async (opt) => {
//     const sl = { date: opt.date || "", time: opt.time || "", note: opt.note || "" };
//     const now = new Date().toISOString();
//     setActLd(true);
//     try {
//       const cl = addCL(mou, "meeting_confirmed", { party: "Industry", from: mou.industry, message: `Confirmed: ${sl.date} at ${sl.time}` });
//       const updMtg = { ...mou.scheduledMeeting, confirmedSlot: sl, confirmedAt: now, industryProposedSlot: null };
//       const pl = { ...bldPayload(mou), scheduledMeeting: updMtg, changeLog: cl };
//       const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
//       upd({ ...r.data, scheduledMeeting: updMtg });
//       toast(`🤝 Meeting confirmed: ${sl.date}!`, "success");
//     } catch (e) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setActLd(false); }
//   };

//   const proposeSlot = async (sd) => {
//     const prop = { date: sd.date || "", time: sd.time || "", note: sd.note || "" };
//     const now = new Date().toISOString();
//     setActLd(true);
//     try {
//       const cl = addCL(mou, "meeting_proposed", { party: "Industry", from: mou.industry, message: `Proposed: ${prop.date} at ${prop.time}` });
//       const updMtg = { ...mou.scheduledMeeting, industryProposedSlot: prop, industryProposedAt: now, confirmedSlot: null };
//       const pl = { ...bldPayload(mou), scheduledMeeting: updMtg, changeLog: cl };
//       const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
//       upd({ ...r.data, scheduledMeeting: updMtg });
//       setMtgModal(false);
//       toast("Slot proposed to University", "info");
//     } catch (e) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setActLd(false); }
//   };

//   if (ld) return <View style={styles.center}><ActivityIndicator size="large" color={C.teal} /></View>;
//   if (!mou) return <View style={{ flex: 1, backgroundColor: C.bg }}><Header title="MOU" back /></View>;

//   const mtg = mou.scheduledMeeting;
//   const cs = mtg?.confirmedSlot, hasC = !!(cs?.date);
//   const ip = mtg?.industryProposedSlot, hasI = !!(ip?.date);
//   const hasOpts = mtg?.options?.length > 0;
//   const hasSingle = !hasOpts && mtg?.date && mtg?.time;
//   const canResp = ["Sent to Industry", "Changes Proposed"].includes(mou.status);
//   const isMutual = mou.status === "Mutually Approved";

//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title={mou.title || "MOU Detail"} back />

//       {/* Status strip */}
//       <View style={[styles.statusStrip, isMutual && { backgroundColor: "#f0fdf4", borderColor: "#86efac" }]}>
//         <SBadge status={mou.status} />
//         {isMutual && <Text style={{ fontSize: 13, color: "#16a34a", fontWeight: "700" }}>🎉 Fully Finalized</Text>}
//         {canResp && (
//           <TouchableOpacity style={styles.respBtn} onPress={() => setRespModal(true)} disabled={actLd}>
//             <Ionicons name="chatbubble-ellipses" size={14} color="#fff" />
//             <Text style={styles.respBtnTxt}>Respond</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabBar}>
//         {["details", "meeting", "activity"].map(t => (
//           <TouchableOpacity key={t} style={[styles.tabItem, tab === t && styles.tabItemActive]} onPress={() => setTab(t)}>
//             <Ionicons name={t === "details" ? "document-text-outline" : t === "meeting" ? "calendar-outline" : "time-outline"} size={15} color={tab === t ? C.teal : C.textLight} />
//             <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>
//               {t === "details" ? "Details" : t === "meeting" ? "Meeting" : "Activity"}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>

//         {tab === "details" && (
//           <>
//             <InfoCard icon="school-outline" title="Collaboration">
//               <Row label="Type" val={mou.collaborationType} />
//               <Row label="University" val={mou.university} />
//               <Row label="Duration" val={`${fmtDate(mou.startDate)} → ${fmtDate(mou.endDate)}`} />
//             </InfoCard>

//             {mou.description && (
//               <InfoCard icon="document-outline" title="Purpose">
//                 <Text style={styles.infoText}>{mou.description}</Text>
//               </InfoCard>
//             )}

//             {mou.objectives?.filter(Boolean).length > 0 && (
//               <InfoCard icon="list-outline" title="Objectives">
//                 {mou.objectives.filter(Boolean).map((o, i) => (
//                   <View key={i} style={styles.bulletRow}>
//                     <View style={styles.bullet} />
//                     <Text style={styles.bulletTxt}>{o}</Text>
//                   </View>
//                 ))}
//               </InfoCard>
//             )}

//             {mou.proposedChanges?.length > 0 && (
//               <View style={[styles.infoCardWrap, { borderLeftWidth: 3, borderLeftColor: C.purple }]}>
//                 <View style={styles.infoCardHead}>
//                   <Ionicons name="alert-circle" size={16} color={C.purple} />
//                   <Text style={[styles.infoCardTitle, { color: C.purple }]}>{mou.proposedChanges.length} Proposed Change(s)</Text>
//                 </View>
//                 {mou.proposedChanges.map((ch, i) => (
//                   <View key={i} style={styles.changeRow}>
//                     <Text style={styles.changeLbl}>{ch.field || `Change #${i + 1}`}</Text>
//                     <Text style={styles.changeVals}>
//                       <Text style={{ color: C.danger, textDecorationLine: "line-through" }}>{ch.oldValue}</Text>
//                       {"  →  "}
//                       <Text style={{ color: C.success }}>{ch.newValue}</Text>
//                     </Text>
//                     {ch.reason && <Text style={styles.changeReason}>Reason: {ch.reason}</Text>}
//                   </View>
//                 ))}
//               </View>
//             )}

//             {(mou.universityStamp || mou.industryStamp) && (
//               <InfoCard icon="ribbon-outline" title="Approvals">
//                 {mou.universityStamp && (
//                   <View style={styles.stampRow}>
//                     <View style={[styles.stampDot, { backgroundColor: mou.universityStamp.type === "approve" ? C.success : C.danger }]} />
//                     <View>
//                       <Text style={styles.stampLbl}>University: {mou.universityStamp.type === "approve" ? "✅ Approved" : "❌ Rejected"}</Text>
//                       <Text style={styles.stampDate}>By {mou.universityStamp.by} · {fmtDate(mou.universityStamp.date)}</Text>
//                     </View>
//                   </View>
//                 )}
//                 {mou.industryStamp && (
//                   <View style={styles.stampRow}>
//                     <View style={[styles.stampDot, { backgroundColor: mou.industryStamp.type === "approve" ? C.success : C.danger }]} />
//                     <View>
//                       <Text style={styles.stampLbl}>Industry: {mou.industryStamp.type === "approve" ? "✅ Approved" : "❌ Rejected"}</Text>
//                       <Text style={styles.stampDate}>By {mou.industryStamp.by} · {fmtDate(mou.industryStamp.date)}</Text>
//                     </View>
//                   </View>
//                 )}
//               </InfoCard>
//             )}
//           </>
//         )}

//         {tab === "meeting" && (
//           <>
//             {!mtg && (
//               <View style={styles.emptyState}>
//                 <Ionicons name="calendar-outline" size={56} color={C.textLight} />
//                 <Text style={styles.emptyTitle}>No meeting scheduled</Text>
//                 <Text style={styles.emptySub}>University will propose a time slot</Text>
//               </View>
//             )}

//             {mtg && hasC && (
//               <View style={styles.confirmedCard}>
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
//                   <View style={styles.confirmedIcon}>
//                     <Ionicons name="checkmark-circle" size={22} color="#fff" />
//                   </View>
//                   <Text style={styles.confirmedTitle}>Meeting Confirmed! 🎉</Text>
//                 </View>
//                 <View style={{ flexDirection: "row", gap: 12 }}>
//                   <View style={styles.dtCell}>
//                     <Text style={styles.dtLabel}>DATE</Text>
//                     <Text style={styles.dtVal}>{cs.date}</Text>
//                   </View>
//                   <View style={styles.dtCell}>
//                     <Text style={styles.dtLabel}>TIME</Text>
//                     <Text style={styles.dtVal}>🕐 {cs.time}</Text>
//                   </View>
//                 </View>
//                 {mtg.venue && <Text style={styles.mtgMeta}>📍 {mtg.venue}</Text>}
//                 {mtg.agenda && <Text style={styles.mtgMeta}>📋 {mtg.agenda}</Text>}
//                 {cs.note && <Text style={styles.mtgMeta}>📌 {cs.note}</Text>}
//                 <Text style={styles.confirmedSince}>Confirmed · {fmtDT(mtg.confirmedAt)}</Text>
//               </View>
//             )}

//             {mtg && !hasC && hasI && (
//               <View style={styles.pendingCard}>
//                 <Text style={styles.pendingTitle}>⏳ Awaiting University Confirmation</Text>
//                 <Text style={styles.pendingSub}>You proposed:</Text>
//                 <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
//                   <View style={[styles.dtCell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}>
//                     <Text style={[styles.dtLabel, { color: "#92400e" }]}>DATE</Text>
//                     <Text style={[styles.dtVal, { color: "#92400e" }]}>{ip.date}</Text>
//                   </View>
//                   <View style={[styles.dtCell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}>
//                     <Text style={[styles.dtLabel, { color: "#92400e" }]}>TIME</Text>
//                     <Text style={[styles.dtVal, { color: "#92400e" }]}>🕐 {ip.time}</Text>
//                   </View>
//                 </View>
//                 {ip.note && <Text style={{ fontSize: 12, color: "#a16207" }}>📌 {ip.note}</Text>}
//                 <TouchableOpacity style={styles.outlineBtn} onPress={() => setMtgModal(true)}>
//                   <Ionicons name="pencil" size={13} color={C.teal} />
//                   <Text style={styles.outlineTxt}>Change Slot</Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             {mtg && !hasC && !hasI && hasOpts && (
//               <>
//                 <View style={styles.infoNote}>
//                   <Ionicons name="information-circle" size={16} color="#0284c7" />
//                   <Text style={styles.infoNoteTxt}>Select a slot or propose your own time</Text>
//                 </View>
//                 {mtg.options.map((opt, i) => (
//                   <View key={i} style={styles.slotCard}>
//                     <View style={{ flex: 1 }}>
//                       <Text style={styles.slotDate}>{opt.date} at {opt.time}</Text>
//                       {opt.note && <Text style={styles.slotNote}>{opt.note}</Text>}
//                     </View>
//                     <TouchableOpacity style={styles.selectBtn} onPress={() => selectSlot(opt)} disabled={actLd}>
//                       {actLd ? <ActivityIndicator color="#fff" size="small" /> : (
//                         <><Ionicons name="checkmark" size={14} color="#fff" /><Text style={styles.selectTxt}>Select</Text></>
//                       )}
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//                 {mtg.venue && <Text style={[styles.mtgMeta, { marginTop: 8 }]}>📍 {mtg.venue}</Text>}
//                 {mtg.agenda && <Text style={styles.mtgMeta}>📋 {mtg.agenda}</Text>}
//                 <TouchableOpacity style={styles.outlineBtn} onPress={() => setMtgModal(true)}>
//                   <Ionicons name="pencil" size={13} color={C.teal} />
//                   <Text style={styles.outlineTxt}>Propose Different Slot</Text>
//                 </TouchableOpacity>
//               </>
//             )}

//             {mtg && !hasC && !hasI && hasSingle && (
//               <>
//                 <View style={styles.infoNote}>
//                   <Ionicons name="information-circle" size={16} color="#0284c7" />
//                   <Text style={styles.infoNoteTxt}>University proposed this time</Text>
//                 </View>
//                 <View style={styles.slotCard}>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.slotDate}>{fmtDate(mtg.date)} at {mtg.time}</Text>
//                     {mtg.venue && <Text style={styles.slotNote}>📍 {mtg.venue}</Text>}
//                     {mtg.agenda && <Text style={styles.slotNote}>📋 {mtg.agenda}</Text>}
//                   </View>
//                 </View>
//                 <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
//                   <TouchableOpacity style={[styles.selectBtn, { flex: 1, justifyContent: "center", paddingVertical: 12 }]}
//                     onPress={() => selectSlot({ date: mtg.date, time: mtg.time, note: "" })} disabled={actLd}>
//                     {actLd ? <ActivityIndicator color="#fff" size="small" /> : (
//                       <><Ionicons name="checkmark-circle" size={15} color="#fff" /><Text style={styles.selectTxt}>Confirm This Slot</Text></>
//                     )}
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.outlineBtn, { flex: 1, justifyContent: "center" }]} onPress={() => setMtgModal(true)}>
//                     <Ionicons name="pencil" size={13} color={C.teal} />
//                     <Text style={styles.outlineTxt}>Propose New</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </>
//         )}

//         {tab === "activity" && (
//           <>
//             {hasC && (
//               <View style={[styles.confirmedCard, { marginBottom: 16 }]}>
//                 <Text style={{ fontSize: 13, fontWeight: "700", color: "#166534", marginBottom: 8 }}>✅ Meeting Confirmed</Text>
//                 <View style={{ flexDirection: "row", gap: 12 }}>
//                   <View style={styles.dtCell}><Text style={styles.dtLabel}>DATE</Text><Text style={styles.dtVal}>{cs.date}</Text></View>
//                   <View style={styles.dtCell}><Text style={styles.dtLabel}>TIME</Text><Text style={styles.dtVal}>🕐 {cs.time}</Text></View>
//                 </View>
//               </View>
//             )}

//             <Text style={styles.actSection}>Timeline</Text>
//             {[
//               { lbl: "Draft Created",     date: mou.createdAt,          done: true },
//               { lbl: "Sent to Industry",  date: mou.sentAt,             done: !!mou.sentAt },
//               { lbl: "Our Response",      date: mou.industryResponseAt, done: !!mou.industryResponseAt },
//               { lbl: "Meeting Confirmed", date: mtg?.confirmedAt,       done: hasC },
//               { lbl: "Mutually Approved", date: null,                   done: isMutual },
//             ].map((t, i) => (
//               <View key={i} style={styles.tlRow}>
//                 <View style={[styles.tlDot, { backgroundColor: t.done ? C.success : C.border }]}>
//                   {t.done && <Ionicons name="checkmark" size={10} color="#fff" />}
//                 </View>
//                 <View style={styles.tlLine} />
//                 <View>
//                   <Text style={[styles.tlLbl, { color: t.done ? C.text : C.textLight }]}>{t.lbl}</Text>
//                   {t.date && <Text style={styles.tlDate}>{fmtDate(t.date)}</Text>}
//                 </View>
//               </View>
//             ))}

//             {(mou.changeLog || []).length > 0 && (
//               <>
//                 <Text style={[styles.actSection, { marginTop: 20 }]}>All Activity</Text>
//                 {[...(mou.changeLog || [])].reverse().map((e, i) => {
//                   const ct = CT[e.type] || { c: C.textLight, bg: C.bg, ic: "📌", lbl: e.type };
//                   return (
//                     <View key={e.id || i} style={[styles.logCard, { backgroundColor: ct.bg, borderColor: ct.c + "30" }]}>
//                       <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
//                         <Text style={{ fontSize: 14 }}>{ct.ic}</Text>
//                         <Text style={{ fontSize: 11, fontWeight: "700", color: ct.c }}>{ct.lbl}</Text>
//                         <Text style={{ marginLeft: "auto", fontSize: 10, color: C.textLight }}>{e.party}</Text>
//                       </View>
//                       {e.message && <Text style={{ fontSize: 12, color: C.text, lineHeight: 18 }}>{e.message}</Text>}
//                       <Text style={{ fontSize: 10, color: C.textLight, marginTop: 4 }}>{fmtDT(e.date)}</Text>
//                     </View>
//                   );
//                 })}
//               </>
//             )}
//           </>
//         )}
//       </ScrollView>

//       <RespModal    visible={respModal} mou={mou} onClose={() => setRespModal(false)} onSave={doResponse} loading={actLd} />
//       <PropMtgModal visible={mtgModal}  mou={mou} onClose={() => setMtgModal(false)}  onSave={proposeSlot} loading={actLd} />
//     </View>
//   );
// }

// // ─── Response Modal ───────────────────────────────────────────
// const RespModal = ({ visible, mou, onClose, onSave, loading }) => {
//   const [type, setType] = useState("comment");
//   const [msg,  setMsg]  = useState("");
//   const [changes, setChanges] = useState([{ field: "", oldValue: "", newValue: "", reason: "" }]);

//   const cfg = {
//     accept:  { c: "#16a34a", bg: "#f0fdf4", lbl: "Accept MOU",      icon: "thumbs-up-outline" },
//     reject:  { c: "#dc2626", bg: "#fef2f2", lbl: "Reject MOU",      icon: "thumbs-down-outline" },
//     comment: { c: "#0284c7", bg: "#eff6ff", lbl: "Comment",         icon: "chatbubble-outline" },
//     change:  { c: "#7c3aed", bg: "#f5f3ff", lbl: "Propose Changes", icon: "git-pull-request-outline" },
//   };

//   const submit = () => {
//     if (!msg.trim() && type !== "accept" && type !== "reject") { Alert.alert("Required", "Enter a message."); return; }
//     onSave({ type, message: msg || (type === "accept" ? `${mou?.industry} accepted.` : `${mou?.industry} rejected.`),
//       changes: type === "change" ? changes.filter(c => c.field).map(c => ({ ...c, date: new Date().toISOString() })) : undefined });
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.sheet}>
//           <View style={styles.sheetHandle} />
//           <View style={styles.sheetHead}>
//             <Text style={styles.sheetTitle}>Respond to MOU</Text>
//             <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.text} /></TouchableOpacity>
//           </View>
//           <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
//             <Text style={styles.fieldLbl}>Response Type</Text>
//             <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 16 }}>
//               {Object.keys(cfg).map(k => (
//                 <TouchableOpacity key={k}
//                   style={[styles.respTypeBtn, type === k && { borderColor: cfg[k].c, backgroundColor: cfg[k].bg }]}
//                   onPress={() => setType(k)}>
//                   <Ionicons name={cfg[k].icon} size={14} color={type === k ? cfg[k].c : C.textLight} />
//                   <Text style={[styles.respTypeTxt, type === k && { color: cfg[k].c }]}>{cfg[k].lbl}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <FieldInput label={type === "accept" ? "Acceptance Note (optional)" : "Message *"}
//               value={msg} onChange={setMsg}
//               placeholder={type === "accept" ? "e.g. We accept as presented." : type === "reject" ? "Reason for rejection..." : "Your message..."} multiline />

//             {type === "change" && (
//               <>
//                 <Text style={[styles.fieldLbl, { color: C.purple, marginTop: 8 }]}>Proposed Changes</Text>
//                 {changes.map((ch, i) => (
//                   <View key={i} style={styles.changeBlock}>
//                     <TextInput style={styles.fieldInput} placeholder="Field / Section" value={ch.field}
//                       onChangeText={v => { const a = [...changes]; a[i].field = v; setChanges(a); }} />
//                     <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
//                       <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} placeholder="Current value"
//                         value={ch.oldValue} onChangeText={v => { const a = [...changes]; a[i].oldValue = v; setChanges(a); }} />
//                       <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} placeholder="New value"
//                         value={ch.newValue} onChangeText={v => { const a = [...changes]; a[i].newValue = v; setChanges(a); }} />
//                     </View>
//                     <TextInput style={[styles.fieldInput, { marginTop: 6 }]} placeholder="Reason for change"
//                       value={ch.reason} onChangeText={v => { const a = [...changes]; a[i].reason = v; setChanges(a); }} />
//                   </View>
//                 ))}
//                 <TouchableOpacity onPress={() => setChanges(c => [...c, { field: "", oldValue: "", newValue: "", reason: "" }])}>
//                   <Text style={{ color: C.purple, fontWeight: "700", textAlign: "center", marginTop: 4 }}>+ Add Change</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </ScrollView>
//           <View style={styles.sheetFoot}>
//             <TouchableOpacity onPress={onClose} style={{ paddingHorizontal: 16, justifyContent: "center" }}>
//               <Text style={{ color: C.textLight, fontWeight: "600" }}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.saveBtn, { flex: 1, backgroundColor: cfg[type].c }]} onPress={submit} disabled={loading}>
//               {loading ? <ActivityIndicator color="#fff" size="small" /> :
//                 <Text style={styles.saveBtnTxt}>Submit Response</Text>}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ─── Propose Meeting Modal ────────────────────────────────────
// const PropMtgModal = ({ visible, mou, onClose, onSave, loading }) => {
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [note, setNote] = useState("");
//   const mtg = mou?.scheduledMeeting;

//   const useOpt = (o) => { setDate(o.date || ""); setTime(o.time || ""); setNote(o.note || ""); };

//   const submit = () => {
//     if (!date || !time) { Alert.alert("Required", "Enter date and time."); return; }
//     onSave({ date, time, note });
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.sheet}>
//           <View style={styles.sheetHandle} />
//           <View style={styles.sheetHead}>
//             <Text style={styles.sheetTitle}>Propose Meeting Slot</Text>
//             <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.text} /></TouchableOpacity>
//           </View>
//           <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
//             <View style={styles.infoNote}>
//               <Ionicons name="information-circle" size={16} color="#0284c7" />
//               <Text style={styles.infoNoteTxt}>University will review and confirm your proposed slot.</Text>
//             </View>

//             {mtg?.options?.length > 0 && (
//               <>
//                 <Text style={[styles.fieldLbl, { marginTop: 12 }]}>University's options (tap to use):</Text>
//                 {mtg.options.map((o, i) => (
//                   <TouchableOpacity key={i} style={styles.optRow} onPress={() => useOpt(o)}>
//                     <Text style={styles.optTxt}>{o.date} at {o.time}</Text>
//                     <Text style={{ color: C.teal, fontWeight: "700", fontSize: 12 }}>Use</Text>
//                   </TouchableOpacity>
//                 ))}
//               </>
//             )}
//             {mtg?.date && !mtg?.options?.length && (
//               <TouchableOpacity style={styles.optRow} onPress={() => useOpt({ date: mtg.date, time: mtg.time })}>
//                 <Text style={styles.optTxt}>{fmtDate(mtg.date)} at {mtg.time}</Text>
//                 <Text style={{ color: C.teal, fontWeight: "700", fontSize: 12 }}>Use</Text>
//               </TouchableOpacity>
//             )}

//             <Text style={[styles.fieldLbl, { marginTop: 16 }]}>Your Preferred Slot:</Text>
//             <FieldInput label="Date (YYYY-MM-DD) *" value={date} onChange={setDate} placeholder="e.g. 2025-08-15" />
//             <FieldInput label="Time (HH:MM) *" value={time} onChange={setTime} placeholder="e.g. 10:00" />
//             <FieldInput label="Note (optional)" value={note} onChange={setNote} placeholder="e.g. Prefer morning" />
//           </ScrollView>
//           <View style={styles.sheetFoot}>
//             <TouchableOpacity onPress={onClose} style={{ paddingHorizontal: 16, justifyContent: "center" }}>
//               <Text style={{ color: C.textLight, fontWeight: "600" }}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.saveBtn, { flex: 1 }]} onPress={submit} disabled={loading}>
//               {loading ? <ActivityIndicator color="#fff" size="small" /> : (
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
//                   <Ionicons name="send" size={14} color="#fff" />
//                   <Text style={styles.saveBtnTxt}>Submit to University</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// //  INTERNSHIPS
// // ═══════════════════════════════════════════════════════════════
// function InternshipsMainScreen() {
//   const nav = useNavigation();
//   const { ax } = useUser();
//   const [items, setItems] = useState([]);
//   const [ld, setLd] = useState(true);
//   useEffect(() => { ax().get(API_INT).then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLd(false)); }, []);
//   if (ld) return <View style={styles.center}><ActivityIndicator color={C.teal} /></View>;
//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="Internships" back />
//       <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
//         <TouchableOpacity style={styles.createBtn} onPress={() => nav.navigate("PostNewInternship")}>
//           <Ionicons name="add-circle" size={20} color="#fff" />
//           <Text style={styles.createBtnTxt}>Post New Internship</Text>
//         </TouchableOpacity>
//         {items.length === 0 && (
//           <View style={styles.emptyState}>
//             <Ionicons name="briefcase-outline" size={56} color={C.textLight} />
//             <Text style={styles.emptyTitle}>No internships yet</Text>
//           </View>
//         )}
//         {items.map((item) => (
//           <View key={item._id || item.id} style={styles.listCard}>
//             <Text style={styles.listCardTitle}>{item.title}</Text>
//             <Text style={styles.listCardSub}>{item.company}</Text>
//             <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
//               <Text style={styles.listCardMeta}>Posted: {fmtDate(item.date || item.createdAt)}</Text>
//               <Text style={styles.listCardMeta}>{item.applications || 0} Applicants</Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// function PostNewInternshipScreen() {
//   const nav = useNavigation();
//   const { user, ax } = useUser();
//   const toast = useToast();
//   const [title, setTitle] = useState("");
//   const [skills, setSkills] = useState("");
//   const [desc, setDesc] = useState("");
//   const [ld, setLd] = useState(false);
//   const submit = async () => {
//     if (!title) { toast("Title required", "error"); return; }
//     setLd(true);
//     try {
//       await ax().post(API_INT, { title, company: user?.name || "", skills, description: desc });
//       toast("Internship posted!", "success"); nav.goBack();
//     } catch (e) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setLd(false); }
//   };
//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="New Internship" back />
//       <ScrollView contentContainerStyle={styles.formPad}>
//         <FieldInput label="Job Title *" value={title} onChange={setTitle} placeholder="e.g. React Developer" />
//         <FieldInput label="Required Skills" value={skills} onChange={setSkills} placeholder="e.g. JavaScript, React" />
//         <FieldInput label="Description" value={desc} onChange={setDesc} placeholder="Responsibilities..." multiline />
//         <TouchableOpacity style={[styles.saveBtn, { marginTop: 24 }]} onPress={submit} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnTxt}>Publish Internship</Text>}
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  PROJECTS
// // ═══════════════════════════════════════════════════════════════
// function ManageProjectsScreen() {
//   const nav = useNavigation();
//   const { ax } = useUser();
//   const [items, setItems] = useState([]);
//   const [ld, setLd] = useState(true);
//   useEffect(() => { ax().get(API_PROJ).then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLd(false)); }, []);
//   if (ld) return <View style={styles.center}><ActivityIndicator color={C.teal} /></View>;
//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="Projects" back />
//       <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
//         <TouchableOpacity style={styles.createBtn} onPress={() => nav.navigate("PostNewProject")}>
//           <Ionicons name="add-circle" size={20} color="#fff" />
//           <Text style={styles.createBtnTxt}>Add New Project</Text>
//         </TouchableOpacity>
//         {items.length === 0 && (
//           <View style={styles.emptyState}>
//             <Ionicons name="flask-outline" size={56} color={C.textLight} />
//             <Text style={styles.emptyTitle}>No projects yet</Text>
//           </View>
//         )}
//         {items.map((item) => (
//           <View key={item._id || item.id} style={styles.listCard}>
//             <Text style={styles.listCardTitle}>{item.title}</Text>
//             <Text style={styles.listCardSub}>{item.type}</Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// function PostNewProjectScreen() {
//   const nav = useNavigation();
//   const { ax } = useUser();
//   const toast = useToast();
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState("Research");
//   const [desc, setDesc] = useState("");
//   const [ld, setLd] = useState(false);
//   const submit = async () => {
//     if (!title) { toast("Title required", "error"); return; }
//     setLd(true);
//     try {
//       await ax().post(API_PROJ, { title, type, description: desc });
//       toast("Project added!", "success"); nav.goBack();
//     } catch (e) { toast(e?.response?.data?.message || "Error", "error"); }
//     finally { setLd(false); }
//   };
//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="New Project" back />
//       <ScrollView contentContainerStyle={styles.formPad}>
//         <FieldInput label="Project Title *" value={title} onChange={setTitle} />
//         <Text style={styles.fieldLbl}>Type</Text>
//         <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 12 }}>
//           {["Research", "Development", "Collaboration"].map(t => (
//             <TouchableOpacity key={t} onPress={() => setType(t)}
//               style={[styles.typeChip, type === t && styles.typeChipActive]}>
//               <Text style={[styles.typeChipTxt, type === t && styles.typeChipTxtActive]}>{t}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <FieldInput label="Description" value={desc} onChange={setDesc} multiline />
//         <TouchableOpacity style={[styles.saveBtn, { marginTop: 24 }]} onPress={submit} disabled={ld}>
//           {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnTxt}>Save Project</Text>}
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  MESSAGES
// // ═══════════════════════════════════════════════════════════════
// function MessagesScreen() {
//   const nav = useNavigation();
//   const chats = [
//     { id: 1, name: "Internship Incharge", sub: "Riphah International University", time: "10:30 AM", msg: "Research grant approved.", avatar: "https://ui-avatars.com/api/?name=II&background=0F2236&color=fff&bold=true", unread: 2 },
//     { id: 2, name: "Industry Liaison",     sub: "Riphah International University", time: "Yesterday", msg: "When can we meet?", avatar: "https://ui-avatars.com/api/?name=IL&background=0D7377&color=fff&bold=true", unread: 0 },
//   ];
//   return (
//     <View style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="Messages" back />
//       <FlatList data={chats} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.chatItem} onPress={() => nav.navigate("ChatScreen", { contact: item })}>
//             <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
//             <View style={{ flex: 1 }}>
//               <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                 <Text style={styles.chatName}>{item.name}</Text>
//                 <Text style={styles.chatTime}>{item.time}</Text>
//               </View>
//               <Text style={styles.chatSub}>{item.sub}</Text>
//               <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//                 <Text style={[styles.chatMsg, item.unread > 0 && { fontWeight: "700", color: C.text }]} numberOfLines={1}>{item.msg}</Text>
//                 {item.unread > 0 && <View style={styles.unreadDot}><Text style={styles.unreadNum}>{item.unread}</Text></View>}
//               </View>
//             </View>
//           </TouchableOpacity>
//         )} />
//     </View>
//   );
// }

// function ChatScreen({ route }) {
//   const nav = useNavigation();
//   const { contact } = route.params || { contact: { name: "University", avatar: "https://ui-avatars.com/api/?name=U" } };
//   const [messages, setMessages] = useState([{ id: 1, text: "Hello! How can we help?", sender: "them", time: "10:00" }]);
//   const [input, setInput] = useState("");
//   const flatRef = useRef(null);
//   const send = () => {
//     if (!input.trim()) return;
//     const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     setMessages(p => [...p, { id: Date.now(), text: input, sender: "me", time: now }]);
//     setInput("");
//     setTimeout(() => setMessages(p => [...p, { id: Date.now() + 1, text: "Sure, let me check.", sender: "them", time: now }]), 1500);
//   };
//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
//       <View style={styles.chatHdr}>
//         <TouchableOpacity onPress={() => nav.goBack()}><Ionicons name="arrow-back" size={24} color={C.navy} /></TouchableOpacity>
//         <Image source={{ uri: contact.avatar }} style={styles.chatHdrAvt} />
//         <View><Text style={styles.chatHdrName}>{contact.name}</Text><Text style={{ fontSize: 11, color: C.success }}>Online</Text></View>
//       </View>
//       <FlatList ref={flatRef} data={messages} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
//         onContentSizeChange={() => flatRef.current?.scrollToEnd()}
//         renderItem={({ item }) => (
//           <View style={[styles.bubble, item.sender === "me" ? styles.bubbleMe : styles.bubbleThem]}>
//             <Text style={{ color: item.sender === "me" ? "#fff" : C.text }}>{item.text}</Text>
//             <Text style={{ fontSize: 10, color: item.sender === "me" ? "#ffffffaa" : C.textLight, marginTop: 3, alignSelf: "flex-end" }}>{item.time}</Text>
//           </View>
//         )} />
//       <View style={styles.inputRow}>
//         <TextInput style={styles.chatInput} value={input} onChangeText={setInput} placeholder="Type a message..." />
//         <TouchableOpacity style={styles.sendBtn} onPress={send}><Ionicons name="send" size={18} color="#fff" /></TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  AI CHATBOT
// // ═══════════════════════════════════════════════════════════════
// function AIChatbotScreen() {
//   const nav = useNavigation();
//   const [msgs, setMsgs] = useState([{ id: 1, text: "Hello! I am CXbot. How can I help with your MOU or partnerships?", sender: "bot" }]);
//   const [input, setInput] = useState("");
//   const [typing, setTyping] = useState(false);
//   const flatRef = useRef(null);
//   const respond = (text) => {
//     if (!text.trim()) return;
//     setMsgs(p => [...p, { id: Date.now(), text, sender: "user" }]);
//     setInput(""); setTyping(true);
//     setTimeout(() => {
//       const t = text.toLowerCase();
//       const reply =
//         t.includes("mou") ? "Manage all MOUs in the MOU section. You can respond, propose changes, or confirm meetings." :
//         t.includes("meeting") ? "Check the Meeting tab in any MOU for scheduling options." :
//         t.includes("internship") ? "Post internships from the Internships section." :
//         t.includes("profile") ? "Update your company profile from the drawer menu." :
//         "I can help with MOUs, internships, projects, and more. What do you need?";
//       setMsgs(p => [...p, { id: Date.now() + 1, text: reply, sender: "bot" }]);
//       setTyping(false);
//     }, 1800);
//   };
//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
//       <Header title="CXbot AI" back />
//       <FlatList ref={flatRef} data={msgs} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
//         onContentSizeChange={() => flatRef.current?.scrollToEnd()}
//         ListFooterComponent={typing ? <Text style={{ color: C.textLight, marginLeft: 12, marginTop: 4, fontSize: 12 }}>CXbot is typing...</Text> : null}
//         renderItem={({ item }) => (
//           <View style={[styles.bubble, item.sender === "user" ? styles.bubbleMe : { ...styles.bubbleThem, backgroundColor: "#E0F7F7" }]}>
//             {item.sender === "bot" && <View style={styles.botIcon}><Ionicons name="sparkles" size={12} color="#fff" /></View>}
//             <Text style={{ color: item.sender === "user" ? "#fff" : C.text }}>{item.text}</Text>
//           </View>
//         )} />
//       <View style={styles.inputRow}>
//         <TextInput style={styles.chatInput} value={input} onChangeText={setInput} placeholder="Ask CXbot anything..." />
//         <TouchableOpacity style={[styles.sendBtn, { backgroundColor: C.teal }]} onPress={() => respond(input)}>
//           <Ionicons name="arrow-up" size={20} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  DRAWER
// // ═══════════════════════════════════════════════════════════════
// function CustomDrawer(props) {
//   const { user } = useUser();
//   const nav = useNavigation();
//   const initials = (n) => n?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "CX";

//   const drawerItems = [
//     { screen: "Dashboard",       icon: "grid-outline",           label: "Dashboard" },
//     { screen: "MoUs",            icon: "document-text-outline",  label: "MOU Management" },
//     { screen: "InternshipsMain", icon: "briefcase-outline",      label: "Internships" },
//     { screen: "ManageProjects",  icon: "flask-outline",          label: "Projects" },
//     { screen: "MessagesMain",    icon: "chatbubbles-outline",    label: "Messages" },
//     { screen: "AIChatbot",       icon: "sparkles-outline",       label: "CXbot AI" },
//     { screen: "Profile",         icon: "person-circle-outline",  label: "My Profile" },
//   ];

//   const current = props.state?.routes[props.state?.index]?.name;

//   return (
//     <View style={{ flex: 1, backgroundColor: C.white }}>
//       <View style={styles.drawerTop}>
//         <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
//           <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
//             <View style={styles.drawerLogoBox}>
//               <Text style={styles.drawerLogoTxt}>CX</Text>
//             </View>
//             <Text style={styles.drawerBrandTxt}>Colla<Text style={{ color: C.goldLight }}>X</Text>ion</Text>
//           </View>
//           <TouchableOpacity onPress={() => nav.closeDrawer()} style={styles.drawerClose}>
//             <Ionicons name="close" size={20} color="rgba(255,255,255,0.7)" />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity style={styles.drawerProfileRow} onPress={() => { nav.navigate("Profile"); nav.closeDrawer(); }}>
//           <View style={styles.drawerAvatar}>
//             {user?.logo
//               ? <Image source={{ uri: user.logo }} style={styles.drawerAvatarImg} />
//               : <Text style={styles.drawerAvatarTxt}>{initials(user?.name || "CX")}</Text>}
//           </View>
//           <View style={{ flex: 1, marginLeft: 12 }}>
//             <Text style={styles.drawerUserName} numberOfLines={1}>{user?.name || "Partner"}</Text>
//             <Text style={styles.drawerUserSub}>{user?.industry || "Industry Partner"}</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.5)" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
//         <View style={{ paddingHorizontal: 12, paddingTop: 16 }}>
//           {drawerItems.map((item, i) => {
//             const active = current === item.screen;
//             return (
//               <TouchableOpacity key={i} style={[styles.drawerItem, active && styles.drawerItemActive]}
//                 onPress={() => { nav.navigate(item.screen); nav.closeDrawer(); }}>
//                 <View style={[styles.drawerItemIcon, { backgroundColor: active ? C.navy + "15" : "transparent" }]}>
//                   <Ionicons name={item.icon} size={20} color={active ? C.navy : C.textMid} />
//                 </View>
//                 <Text style={[styles.drawerItemTxt, active && { color: C.navy, fontWeight: "700" }]}>{item.label}</Text>
//                 {active && <View style={styles.drawerActiveDot} />}
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         <View style={styles.drawerFooter}>
//           <Text style={styles.drawerFooterTxt}>CollaXion v2.0</Text>
//           <Text style={styles.drawerFooterSub}>Industry Partner Portal</Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  SMALL REUSABLE COMPONENTS
// // ═══════════════════════════════════════════════════════════════
// const FieldInput = ({ label, value, onChange, placeholder, multiline, editable = true, kbType }) => (
//   <View style={{ marginBottom: 12 }}>
//     {label && <Text style={styles.fieldLbl}>{label}</Text>}
//     <TextInput
//       style={[styles.fieldInput, multiline && { height: 90, textAlignVertical: "top" }, !editable && { backgroundColor: "#F3F4F6", color: C.textLight }]}
//       value={value} onChangeText={onChange} placeholder={placeholder}
//       placeholderTextColor={C.textLight} multiline={multiline} editable={editable}
//       keyboardType={kbType || "default"} autoCapitalize="none" />
//   </View>
// );

// const InfoCard = ({ icon, title, children }) => (
//   <View style={styles.infoCardWrap}>
//     <View style={styles.infoCardHead}>
//       <Ionicons name={icon} size={16} color={C.teal} />
//       <Text style={styles.infoCardTitle}>{title}</Text>
//     </View>
//     {children}
//   </View>
// );

// const Row = ({ label, val }) => (
//   <View style={styles.infoRow}>
//     <Text style={styles.infoRowLbl}>{label}</Text>
//     <Text style={styles.infoRowVal}>{val || "—"}</Text>
//   </View>
// );

// // ═══════════════════════════════════════════════════════════════
// //  NAVIGATION
// // ═══════════════════════════════════════════════════════════════
// const Drawer = createDrawerNavigator();
// const Stack  = createNativeStackNavigator();

// function MainDrawer() {
//   return (
//     <Drawer.Navigator
//       drawerContent={props => <CustomDrawer {...props} />}
//       screenOptions={{ headerShown: false, drawerStyle: { width: width * 0.80 } }}>
//       <Drawer.Screen name="Dashboard"        component={DashboardScreen} />
//       <Drawer.Screen name="MoUs"             component={MoUScreen} />
//       <Drawer.Screen name="InternshipsMain"  component={InternshipsMainScreen} />
//       <Drawer.Screen name="ManageProjects"   component={ManageProjectsScreen} />
//       <Drawer.Screen name="MessagesMain"     component={MessagesScreen} />
//       <Drawer.Screen name="AIChatbot"        component={AIChatbotScreen} />
//       <Drawer.Screen name="Profile"          component={ProfileScreen} />
//       {/* Hidden screens */}
//       <Drawer.Screen name="CreateMoU"           component={CreateMoUScreen}          options={{ drawerItemStyle: { display: "none" } }} />
//       <Drawer.Screen name="PostNewInternship"   component={PostNewInternshipScreen}  options={{ drawerItemStyle: { display: "none" } }} />
//       <Drawer.Screen name="PostNewProject"      component={PostNewProjectScreen}     options={{ drawerItemStyle: { display: "none" } }} />
//       <Drawer.Screen name="ChatScreen"          component={ChatScreen}               options={{ drawerItemStyle: { display: "none" } }} />
//     </Drawer.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <UserProvider>
//       <ToastProvider>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="MainDrawer" component={MainDrawer} />
//           <Stack.Screen name="MouDetail"  component={MouDetailScreen} />
//         </Stack.Navigator>
//       </ToastProvider>
//     </UserProvider>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  STYLES
// // ═══════════════════════════════════════════════════════════════
// const styles = StyleSheet.create({
//   center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.bg },

//   toast: { position: "absolute", top: Platform.OS === "ios" ? 56 : 40, left: 12, right: 12,
//     flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 14,
//     borderRadius: 16, borderWidth: 1, elevation: 12, zIndex: 9999 },
//   toastTxt: { fontSize: 13, fontWeight: "700", flex: 1 },

//   hdr: { backgroundColor: C.white, paddingTop: Platform.OS === "ios" ? 52 : 42, paddingBottom: 14,
//     paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//     elevation: 2, borderBottomWidth: 1, borderColor: C.border },
//   hdrTitle: { flex: 1, fontSize: 17, fontWeight: "700", color: C.navy, marginHorizontal: 12 },
//   hdrBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
//   hdrAction: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.teal,
//     justifyContent: "center", alignItems: "center" },

//   badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
//   badgeTxt: { fontSize: 10, fontWeight: "700" },

//   dashBanner: { backgroundColor: C.navy, paddingTop: Platform.OS === "ios" ? 56 : 46, paddingBottom: 24, paddingHorizontal: 20 },
//   dashBannerContent: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
//   dashMenuBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
//   dashGreet: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: "500" },
//   dashName:  { fontSize: 18, fontWeight: "800", color: C.white },
//   dashAvatar:{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.teal,
//     justifyContent: "center", alignItems: "center", overflow: "hidden",
//     borderWidth: 2, borderColor: C.goldLight, position: "relative" },
//   dashAvatarImg: { width: 44, height: 44, borderRadius: 22 },
//   dashAvatarTxt: { fontSize: 15, fontWeight: "900", color: "#fff" },
//   dashAvatarDot: { position: "absolute", bottom: 1, right: 1, width: 10, height: 10,
//     borderRadius: 5, backgroundColor: C.success, borderWidth: 1.5, borderColor: C.navy },

//   statsRow: { flexDirection: "row", justifyContent: "space-between" },
//   statPill: { flex: 1, alignItems: "center", paddingVertical: 12,
//     borderRadius: 14, backgroundColor: "rgba(255,255,255,0.08)", marginHorizontal: 3 },
//   statN:   { fontSize: 22, fontWeight: "900", color: C.white },
//   statLbl: { fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 2, fontWeight: "600" },

//   alertBanner: { marginHorizontal: 16, marginTop: 16, flexDirection: "row", alignItems: "center",
//     backgroundColor: "#FFF8E6", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#F0C96A44", gap: 8 },
//   alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.gold },
//   alertTxt: { flex: 1, fontSize: 13, color: "#92400E", fontWeight: "600" },

//   sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//     paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
//   sectionTitle: { fontSize: 16, fontWeight: "800", color: C.navy },
//   seeAll: { fontSize: 13, color: C.teal, fontWeight: "700" },

//   actionsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 8, marginBottom: 8 },
//   actionTile:  { width: (width - 56) / 3, backgroundColor: C.white, borderRadius: 16,
//     padding: 14, alignItems: "center", elevation: 2 },
//   actionTileIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: "center", alignItems: "center", marginBottom: 8 },
//   actionTileLbl:  { fontSize: 11, fontWeight: "700", color: C.text, textAlign: "center" },

//   recentMouCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: C.white, borderRadius: 14,
//     padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", elevation: 1 },
//   recentMouLeft: { flex: 1, marginRight: 10 },
//   recentMouTitle: { fontSize: 14, fontWeight: "700", color: C.navy },
//   recentMouSub:   { fontSize: 12, color: C.textMid, marginTop: 2 },
//   recentMouDate:  { fontSize: 11, color: C.textLight, marginTop: 3 },

//   companyCard: { margin: 16, backgroundColor: C.white, borderRadius: 16, padding: 16,
//     flexDirection: "row", alignItems: "center", justifyContent: "space-between", elevation: 2 },
//   companyCardLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
//   companyLogoBox: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.bg,
//     justifyContent: "center", alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: C.border },
//   companyLogoImg: { width: 52, height: 52, borderRadius: 14 },
//   companyLogoTxt: { fontSize: 18, fontWeight: "900", color: C.navy },
//   companyCardName: { fontSize: 14, fontWeight: "800", color: C.navy },
//   companyCardSub:  { fontSize: 12, color: C.textMid, marginTop: 2 },
//   companyCardAddr: { fontSize: 11, color: C.textLight, marginTop: 2 },
//   editProfileBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#E0F7F7",
//     paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
//   editProfileTxt: { fontSize: 12, color: C.teal, fontWeight: "700" },

//   profBanner: { backgroundColor: C.navy, paddingTop: Platform.OS === "ios" ? 52 : 42, paddingBottom: 28,
//     alignItems: "center", gap: 8 },
//   profAvatarWrap: { position: "relative", marginBottom: 4 },
//   profAvatarImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: C.gold },
//   profAvatarTxt: { fontSize: 32, fontWeight: "900", color: "#fff", width: 96, height: 96,
//     borderRadius: 48, backgroundColor: C.teal, textAlign: "center", lineHeight: 96,
//     borderWidth: 3, borderColor: C.gold },
//   profCamBtn: { position: "absolute", bottom: 2, right: 2, width: 30, height: 30, borderRadius: 15,
//     backgroundColor: C.gold, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: C.navy },
//   profName: { fontSize: 20, fontWeight: "800", color: "#fff" },
//   verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(13,115,119,0.3)",
//     paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
//   verifiedTxt: { fontSize: 12, color: C.tealLight, fontWeight: "600" },
//   profForm: { padding: 20 },
//   profSection: { fontSize: 14, fontWeight: "800", color: C.navy, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 },
//   fieldWrap:  { marginBottom: 14 },
//   fieldLbl:   { fontSize: 12, fontWeight: "700", color: C.navy, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
//   fieldInput: { backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
//     padding: 13, fontSize: 14, color: C.text, marginTop: 4 },
//   saveBtn:    { backgroundColor: C.navy, padding: 16, borderRadius: 14, alignItems: "center", justifyContent: "center", flexDirection: "row" },
//   saveBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },

//   filterRow:  { flexDirection: "row", backgroundColor: C.white, paddingHorizontal: 12, paddingVertical: 10,
//     borderBottomWidth: 1, borderColor: C.border, gap: 8 },
//   filterTab:  { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.bg },
//   filterTabActive: { backgroundColor: C.navy },
//   filterTabTxt:    { fontSize: 12, fontWeight: "600", color: C.textLight },
//   filterTabTxtActive: { color: "#fff" },

//   mouListCard: { backgroundColor: C.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
//   mouListCardUrgent: { borderLeftWidth: 4, borderLeftColor: C.gold },
//   urgentBanner: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#FFF8E6",
//     paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginBottom: 10 },
//   urgentTxt: { fontSize: 11, color: "#92400E", fontWeight: "700" },
//   mouListHead: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
//   mouListTitle: { fontSize: 15, fontWeight: "700", color: C.navy },
//   mouListSub: { fontSize: 12, color: C.textMid, marginTop: 3 },
//   mouListFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
//   mouListDate: { fontSize: 12, color: C.textLight },
//   mtgConfirmedChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#dcfce7",
//     paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
//   mtgConfirmedTxt: { fontSize: 11, color: "#16a34a", fontWeight: "600" },

//   emptyState: { alignItems: "center", paddingVertical: 60 },
//   emptyTitle: { fontSize: 17, fontWeight: "700", color: C.textLight, marginTop: 14 },
//   emptySub:   { fontSize: 13, color: C.textLight, marginTop: 6 },

//   stepRow: { flexDirection: "row", alignItems: "center", justifyContent: "center",
//     paddingVertical: 16, paddingHorizontal: 24, backgroundColor: C.white, borderBottomWidth: 1, borderColor: C.border },
//   stepItem: { flexDirection: "row", alignItems: "center" },
//   stepDot:  { width: 28, height: 28, borderRadius: 14, backgroundColor: C.bg, borderWidth: 2, borderColor: C.border,
//     justifyContent: "center", alignItems: "center" },
//   stepDotActive: { backgroundColor: C.teal, borderColor: C.teal },
//   stepNum: { fontSize: 12, fontWeight: "700", color: C.textLight },
//   stepLbl: { fontSize: 10, color: C.textLight, fontWeight: "600", marginLeft: 6, marginRight: 8 },
//   stepLine: { width: 24, height: 2, backgroundColor: C.border, marginHorizontal: 4 },
//   stepLineActive: { backgroundColor: C.teal },
//   stepHeading: { fontSize: 17, fontWeight: "800", color: C.navy, marginBottom: 20 },
//   createForm: { padding: 20, paddingBottom: 60 },
//   typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 16 },
//   typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
//     borderColor: C.border, backgroundColor: C.white },
//   typeChipActive: { backgroundColor: C.teal, borderColor: C.teal },
//   typeChipTxt: { fontSize: 12, color: C.textMid, fontWeight: "600" },
//   typeChipTxtActive: { color: "#fff" },
//   objNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.navy,
//     justifyContent: "center", alignItems: "center", flexShrink: 0 },
//   objNumTxt: { fontSize: 11, fontWeight: "900", color: "#fff" },
//   addRowBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, marginTop: 4 },
//   addRowTxt: { fontSize: 13, color: C.teal, fontWeight: "700" },
//   reviewCard: { backgroundColor: "#F0FAFA", borderRadius: 14, padding: 16, marginTop: 20, borderWidth: 1, borderColor: C.teal + "33" },
//   reviewTitle: { fontSize: 14, fontWeight: "800", color: C.teal, marginBottom: 12 },
//   reviewRow:   { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8,
//     borderBottomWidth: 1, borderColor: C.border },
//   reviewLbl:   { fontSize: 13, color: C.textMid, fontWeight: "600" },
//   reviewVal:   { fontSize: 13, color: C.navy, fontWeight: "700", maxWidth: "55%", textAlign: "right" },
//   stepBtns: { flexDirection: "row", gap: 12, marginTop: 32 },
//   backStepBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, paddingVertical: 14,
//     borderRadius: 14, borderWidth: 1.5, borderColor: C.teal },
//   backStepTxt: { fontSize: 14, color: C.teal, fontWeight: "700" },
//   nextStepBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
//     backgroundColor: C.navy, padding: 14, borderRadius: 14 },
//   nextStepTxt: { fontSize: 14, color: "#fff", fontWeight: "700" },

//   statusStrip: { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
//     paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.white,
//     borderBottomWidth: 1, borderColor: C.border, gap: 10 },
//   respBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.teal,
//     paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
//   respBtnTxt: { fontSize: 12, color: "#fff", fontWeight: "700" },
//   tabBar:  { flexDirection: "row", backgroundColor: C.white, borderBottomWidth: 1, borderColor: C.border },
//   tabItem: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
//     gap: 5, paddingVertical: 13 },
//   tabItemActive: { borderBottomWidth: 2.5, borderBottomColor: C.teal },
//   tabTxt:  { fontSize: 12, color: C.textLight, fontWeight: "600" },
//   tabTxtActive: { color: C.teal, fontWeight: "700" },

//   infoCardWrap: { backgroundColor: C.white, borderRadius: 14, padding: 16, marginBottom: 12, elevation: 1 },
//   infoCardHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 10,
//     borderBottomWidth: 1, borderColor: C.border },
//   infoCardTitle: { fontSize: 14, fontWeight: "800", color: C.navy },
//   infoRow:   { flexDirection: "row", justifyContent: "space-between", paddingVertical: 7 },
//   infoRowLbl:{ fontSize: 12, color: C.textLight, fontWeight: "600" },
//   infoRowVal:{ fontSize: 13, color: C.navy, fontWeight: "700", maxWidth: "58%", textAlign: "right" },
//   infoText:  { fontSize: 13, color: C.text, lineHeight: 20 },
//   bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 },
//   bullet:    { width: 6, height: 6, borderRadius: 3, backgroundColor: C.teal, marginTop: 6, flexShrink: 0 },
//   bulletTxt: { fontSize: 13, color: C.text, flex: 1, lineHeight: 20 },

//   changeRow:    { backgroundColor: "#F5F3FF", borderRadius: 10, padding: 12, marginBottom: 8 },
//   changeLbl:    { fontSize: 12, fontWeight: "800", color: C.purple },
//   changeVals:   { fontSize: 13, marginTop: 4 },
//   changeReason: { fontSize: 11, color: C.textLight, marginTop: 4 },

//   stampRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
//   stampDot: { width: 10, height: 10, borderRadius: 5 },
//   stampLbl: { fontSize: 13, fontWeight: "700", color: C.text },
//   stampDate:{ fontSize: 11, color: C.textLight, marginTop: 2 },

//   confirmedCard: { backgroundColor: "#F0FDF4", borderWidth: 1.5, borderColor: "#86EFAC", borderRadius: 16, padding: 18, marginBottom: 14 },
//   confirmedIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#16A34A", justifyContent: "center", alignItems: "center" },
//   confirmedTitle: { fontSize: 16, fontWeight: "800", color: "#166534" },
//   confirmedSince: { fontSize: 11, color: "#6B7280", marginTop: 12 },
//   dtCell: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#BBF7D0" },
//   dtLabel:{ fontSize: 9, color: "#6B7280", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
//   dtVal:  { fontSize: 14, fontWeight: "800", color: "#15803D" },
//   mtgMeta:{ fontSize: 12, color: C.textMid, marginTop: 8 },

//   pendingCard:  { backgroundColor: "#FFFBEB", borderWidth: 1.5, borderColor: "#FDE68A", borderRadius: 16, padding: 16, marginBottom: 14 },
//   pendingTitle: { fontSize: 14, fontWeight: "700", color: "#92400E", marginBottom: 6 },
//   pendingSub:   { fontSize: 12, color: "#A16207", marginBottom: 10 },

//   infoNote: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#EFF6FF",
//     padding: 12, borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: "#BFDBFE" },
//   infoNoteTxt: { fontSize: 12, color: "#0284C7", flex: 1, fontWeight: "500" },

//   slotCard: { backgroundColor: C.white, borderRadius: 14, padding: 14, marginBottom: 10,
//     flexDirection: "row", alignItems: "center", gap: 12, elevation: 1, borderWidth: 1, borderColor: "#BFDBFE" },
//   slotDate: { fontSize: 14, fontWeight: "700", color: C.navy },
//   slotNote: { fontSize: 12, color: C.textMid, marginTop: 3 },
//   selectBtn:{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#16A34A",
//     paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
//   selectTxt:{ fontSize: 12, color: "#fff", fontWeight: "700" },
//   outlineBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1.5, borderColor: C.teal,
//     borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, marginTop: 12, alignSelf: "flex-start" },
//   outlineTxt: { fontSize: 12, color: C.teal, fontWeight: "700" },

//   actSection: { fontSize: 14, fontWeight: "800", color: C.navy, marginBottom: 14 },
//   tlRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
//   tlDot: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", flexShrink: 0 },
//   tlLine:{ display: "none" },
//   tlLbl: { fontSize: 13, fontWeight: "600" },
//   tlDate:{ fontSize: 11, color: C.textLight, marginTop: 2 },
//   logCard:{ borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1 },

//   overlay:    { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
//   sheet:      { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
//     maxHeight: "92%", paddingBottom: Platform.OS === "ios" ? 34 : 16 },
//   sheetHandle:{ width: 36, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: "center", marginTop: 10 },
//   sheetHead:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//     padding: 20, borderBottomWidth: 1, borderColor: C.border },
//   sheetTitle: { fontSize: 16, fontWeight: "800", color: C.navy, flex: 1 },
//   sheetFoot:  { flexDirection: "row", gap: 12, padding: 16, borderTopWidth: 1, borderColor: C.border },

//   respTypeBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 14,
//     borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.white, minWidth: "42%" },
//   respTypeTxt: { fontSize: 12, fontWeight: "700", color: C.textLight },
//   changeBlock: { backgroundColor: "#F5F3FF", borderRadius: 12, padding: 12, marginBottom: 10 },

//   optRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//     backgroundColor: "#F0F9FF", borderRadius: 10, padding: 12, marginBottom: 6,
//     borderWidth: 1, borderColor: "#BAE6FD" },
//   optTxt: { fontSize: 13, color: "#0284C7", fontWeight: "600" },

//   listCard:    { backgroundColor: C.white, borderRadius: 14, padding: 16, marginBottom: 10, elevation: 1 },
//   listCardTitle:{ fontSize: 15, fontWeight: "700", color: C.navy },
//   listCardSub:  { fontSize: 12, color: C.textMid, marginTop: 4 },
//   listCardMeta: { fontSize: 12, color: C.textLight },
//   createBtn:   { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
//     backgroundColor: C.navy, padding: 14, borderRadius: 14, marginBottom: 16 },
//   createBtnTxt:{ color: "#fff", fontSize: 15, fontWeight: "700" },
//   formPad:     { padding: 20, paddingBottom: 60 },

//   chatItem: { flexDirection: "row", backgroundColor: C.white, borderRadius: 14, marginBottom: 10, padding: 14, gap: 12, elevation: 1 },
//   chatAvatar:{ width: 48, height: 48, borderRadius: 24 },
//   chatName: { fontSize: 14, fontWeight: "700", color: C.navy },
//   chatTime: { fontSize: 11, color: C.textLight },
//   chatSub:  { fontSize: 11, color: C.teal, fontWeight: "600", marginBottom: 3 },
//   chatMsg:  { fontSize: 13, color: C.textLight, flex: 1 },
//   unreadDot:{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.navy, justifyContent: "center", alignItems: "center" },
//   unreadNum:{ fontSize: 10, color: "#fff", fontWeight: "700" },
//   chatHdr:  { flexDirection: "row", alignItems: "center", gap: 12, padding: 16,
//     paddingTop: Platform.OS === "ios" ? 52 : 42, backgroundColor: C.white, elevation: 2, borderBottomWidth: 1, borderColor: C.border },
//   chatHdrAvt: { width: 38, height: 38, borderRadius: 19 },
//   chatHdrName:{ fontSize: 15, fontWeight: "700", color: C.navy },
//   bubble:   { padding: 12, borderRadius: 18, maxWidth: "80%", marginBottom: 10 },
//   bubbleMe: { alignSelf: "flex-end", backgroundColor: C.navy, borderBottomRightRadius: 4 },
//   bubbleThem:{ alignSelf: "flex-start", backgroundColor: "#E5E7EB", borderBottomLeftRadius: 4 },
//   botIcon:  { width: 22, height: 22, borderRadius: 11, backgroundColor: C.teal,
//     justifyContent: "center", alignItems: "center", marginBottom: 6 },
//   inputRow: { flexDirection: "row", padding: 12, backgroundColor: C.white,
//     borderTopWidth: 1, borderColor: C.border, alignItems: "center", gap: 10 },
//   chatInput:{ flex: 1, backgroundColor: C.bg, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
//   sendBtn:  { width: 44, height: 44, borderRadius: 22, backgroundColor: C.navy, justifyContent: "center", alignItems: "center" },

//   drawerTop: { backgroundColor: C.navy, paddingTop: Platform.OS === "ios" ? 58 : 46,
//     paddingHorizontal: 20, paddingBottom: 24 },
//   drawerLogoBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.teal,
//     justifyContent: "center", alignItems: "center" },
//   drawerLogoTxt: { fontSize: 13, fontWeight: "900", color: "#fff" },
//   drawerBrandTxt:{ fontSize: 18, fontWeight: "800", color: "#fff" },
//   drawerClose: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.1)",
//     justifyContent: "center", alignItems: "center" },
//   drawerProfileRow: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.08)",
//     borderRadius: 16, padding: 12 },
//   drawerAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.teal,
//     justifyContent: "center", alignItems: "center", overflow: "hidden",
//     borderWidth: 2, borderColor: "rgba(255,255,255,0.25)" },
//   drawerAvatarImg: { width: 52, height: 52, borderRadius: 26 },
//   drawerAvatarTxt: { fontSize: 18, fontWeight: "900", color: "#fff" },
//   drawerUserName:  { fontSize: 15, fontWeight: "800", color: "#fff" },
//   drawerUserSub:   { fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 },
//   drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10,
//     borderRadius: 14, marginBottom: 4, gap: 12 },
//   drawerItemActive: { backgroundColor: C.navy + "0D" },
//   drawerItemIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center" },
//   drawerItemTxt:  { flex: 1, fontSize: 14, fontWeight: "600", color: C.textMid },
//   drawerActiveDot:{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.teal },
//   drawerFooter:   { padding: 20, paddingTop: 10, borderTopWidth: 1, borderColor: C.border, margin: 12, marginTop: 20, borderRadius: 12 },
//   drawerFooterTxt:{ fontSize: 12, fontWeight: "700", color: C.textMid },
//   drawerFooterSub:{ fontSize: 11, color: C.textLight, marginTop: 2 },
// });









































//.........................................




import { Ionicons } from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, {
  createContext, useCallback, useContext,
  useEffect, useRef, useState
} from "react";
import {
  ActivityIndicator, Alert, Animated, Dimensions,
  FlatList, Image, KeyboardAvoidingView,
  Modal, Platform, RefreshControl, ScrollView,
  StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

// ─── THEME ──────────────────────────────────────────────────────
const C = {
  navy:       "#0F2236",
  navyDark:   "#08151F",
  navyMid:    "#193648",
  teal:       "#0D7377",
  tealLight:  "#14BDBD",
  gold:       "#C9A84C",
  goldLight:  "#F0C96A",
  offWhite:   "#F5F7FA",
  white:      "#FFFFFF",
  text:       "#1A2332",
  textMid:    "#4A5568",
  textLight:  "#8A96A3",
  border:     "#E2EAF0",
  success:    "#10B981",
  danger:     "#EF4444",
  warning:    "#F59E0B",
  purple:     "#7C3AED",
  card:       "#FFFFFF",
  bg:         "#EEF3F8",
};

// ─── API ────────────────────────────────────────────────────────
const BASE = "http://192.168.0.245:5000";
const API_MOU  = `${BASE}/api/industry/mous`;
const API_INT  = `${BASE}/api/industry/internships`;
const API_PROJ = `${BASE}/api/industry/projects`;

// ─── STATUS CONFIG ───────────────────────────────────────────────
const SC = {
  Draft:                    { c: "#64748b", bg: "#f1f5f9",  lbl: "Draft" },
  "Sent to Industry laison Incharge":       { c: "#d97706", bg: "#fffbeb",  lbl: "Sent to Us" },
  "Changes Proposed":       { c: "#7c3aed", bg: "#f5f3ff",  lbl: "Changes Proposed" },
  "Industry Responded":     { c: "#0891b2", bg: "#ecfeff",  lbl: "Responded" },
  "Approved by Industry":   { c: "#059669", bg: "#ecfdf5",  lbl: "We Approved ✓" },
  "Approved by University": { c: "#0284c7", bg: "#e0f2fe",  lbl: "Uni Approved" },
  "Mutually Approved":      { c: "#16a34a", bg: "#dcfce7",  lbl: "Mutually Approved ✓" },
  Rejected:                 { c: "#dc2626", bg: "#fef2f2",  lbl: "Rejected" },
};

const CT = {
  industry_change:    { c: "#7c3aed", bg: "#f5f3ff", ic: "🏭", lbl: "Industry Changed" },
  industry_approve:   { c: "#059669", bg: "#ecfdf5", ic: "✅", lbl: "Industry Approved" },
  industry_reject:    { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Industry Rejected" },
  industry_response:  { c: "#0891b2", bg: "#ecfeff", ic: "💬", lbl: "Industry Response" },
  university_change:  { c: "#0284c7", bg: "#e0f2fe", ic: "🎓", lbl: "University Changed" },
  university_approve: { c: "#16a34a", bg: "#dcfce7", ic: "✅", lbl: "Uni Approved" },
  university_reject:  { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Uni Rejected" },
  meeting_proposed:   { c: "#7c3aed", bg: "#f5f3ff", ic: "📅", lbl: "Meeting Proposed" },
  meeting_confirmed:  { c: "#16a34a", bg: "#dcfce7", ic: "🤝", lbl: "Meeting Confirmed" },
};

// ─── HELPERS ─────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return d; }
};
const fmtDT = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return d; }
};
const addCL = (m, type, data = {}) =>
  [...(m.changeLog || []), { id: Date.now(), type, date: new Date().toISOString(), ...data }];

const bldPayload = (m) => ({
  title: m.title, university: m.university, industry: m.industry,
  collaborationType: m.collaborationType, startDate: m.startDate, endDate: m.endDate,
  description: m.description, objectives: m.objectives || [],
  responsibilities: m.responsibilities, terms: m.terms || [],
  signatories: m.signatories, universityContact: m.universityContact,
  industryContact: m.industryContact, universityLogo: m.universityLogo || "",
  industryLogo: m.industryLogo || "", status: m.status,
  universityStamp: m.universityStamp, industryStamp: m.industryStamp,
  sentAt: m.sentAt, industryResponseAt: m.industryResponseAt,
  proposedChanges: m.proposedChanges || [], changeLog: m.changeLog || [],
  scheduledMeeting: m.scheduledMeeting || null,
});

// ─── USER CONTEXT ────────────────────────────────────────────────
const UserCtx = createContext(null);
const useUser = () => useContext(UserCtx);

const DEFAULT_USER = {
  _id: "industry_001",
  name: "Edit Industry Name",
  email: "hr@techsolutions.com",
  industry: "Information Technology",
  phone: "+",
  website: "Edit Industry URL",
  address: "",
  about: "Edit About",
  logo: "",
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(DEFAULT_USER);
  const ax = useCallback(() => axios.create({ timeout: 10000 }), []);
  const updateUser = (data) => setUser((p) => ({ ...p, ...data }));
  return <UserCtx.Provider value={{ user, updateUser, ax }}>{children}</UserCtx.Provider>;
};

// ─── TOAST ───────────────────────────────────────────────────────
const ToastCtx = createContext(null);
const useToast = () => useContext(ToastCtx);

const ToastProvider = ({ children }) => {
  const [t, setT] = useState(null);
  const anim = useRef(new Animated.Value(0)).current;
  const show = (msg, type = "info") => {
    setT({ msg, type });
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2600),
      Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setT(null));
  };
  const colors = { success: ["#d1fae5", "#059669"], error: ["#fee2e2", "#dc2626"], info: ["#dbeafe", "#2563eb"] };
  const [bg, fg] = (colors)[t?.type || "info"] || colors.info;
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {t && (
        <Animated.View style={[styles.toast, { backgroundColor: bg, borderColor: fg + "66",
          opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
          <Ionicons name={t.type === "success" ? "checkmark-circle" : t.type === "error" ? "close-circle" : "information-circle"} size={18} color={fg} />
          <Text style={[styles.toastTxt, { color: fg }]}>{t.msg}</Text>
        </Animated.View>
      )}
    </ToastCtx.Provider>
  );
};

// ─── STATUS BADGE ────────────────────────────────────────────────
const SBadge = ({ status }) => {
  const s = SC[status] || { c: C.textLight, bg: C.bg, lbl: status };
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeTxt, { color: s.c }]}>{s.lbl}</Text>
    </View>
  );
};

// ─── HEADER ──────────────────────────────────────────────────────
const Header = ({ title, back = false, right }) => {
  const nav = useNavigation();
  return (
    <View style={styles.hdr}>
      <TouchableOpacity onPress={() => back ? nav.goBack() : nav.openDrawer()} style={styles.hdrBtn}>
        <Ionicons name={back ? "arrow-back" : "menu-outline"} size={24} color={C.navy} />
      </TouchableOpacity>
      <Text style={styles.hdrTitle} numberOfLines={1}>{title}</Text>
      {right ? right : <View style={{ width: 40 }} />}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════
function DashboardScreen() {
  const nav = useNavigation();
  const { user, ax } = useUser();
  const [counts, setCounts] = useState({ mous: 0, internships: 0, projects: 0, pending: 0 });
  const [recentMous, setRecentMous] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    const a = ax();
    Promise.all([
      a.get(`${API_MOU}/mine`, { params: { industryId: user?._id, industry: user?.name } }).catch(() => ({ data: [] })),
      a.get(API_INT).catch(() => ({ data: [] })),
      a.get(API_PROJ).catch(() => ({ data: [] })),
    ]).then(([m, i, p]) => {
      const mous = m.data || [];
      const pending = mous.filter((x) => ["Sent to Industry Laison Incharge", "Changes Proposed"].includes(x.status)).length;
      setCounts({ mous: mous.length, internships: (i.data || []).length, projects: (p.data || []).length, pending });
      setRecentMous(mous.slice(0, 3));
    });
  }, []);

  const initials = (name) => name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "CX";

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />

      {/* Top Banner */}
      <View style={styles.dashBanner}>
        <View style={styles.dashBannerContent}>
          <TouchableOpacity onPress={() => nav.openDrawer()} style={styles.dashMenuBtn}>
            <Ionicons name="menu" size={26} color={C.white} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.dashGreet}>Good day,</Text>
            <Text style={styles.dashName} numberOfLines={1}>{user?.name || "Partner"}</Text>
          </View>
          <TouchableOpacity onPress={() => nav.navigate("Profile")} style={styles.dashAvatar}>
            {user?.logo
              ? <Image source={{ uri: user.logo }} style={styles.dashAvatarImg} />
              : <Text style={styles.dashAvatarTxt}>{initials(user?.name || "CX")}</Text>}
            <View style={styles.dashAvatarDot} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { n: counts.mous,         lbl: "MOUs",        icon: "document-text" },
            { n: counts.internships,  lbl: "Internships", icon: "briefcase" },
            { n: counts.projects,     lbl: "Projects",    icon: "flask" },
            { n: counts.pending,      lbl: "Pending",     icon: "time", warn: true },
          ].map((s, i) => (
            <View key={i} style={styles.statPill}>
              <Text style={[styles.statN, s.warn && counts.pending > 0 && { color: C.goldLight }]}>{s.n}</Text>
              <Text style={styles.statLbl}>{s.lbl}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* Pending Alert */}
          {counts.pending > 0 && (
            <TouchableOpacity onPress={() => nav.navigate("MoUs")} style={styles.alertBanner}>
              <View style={styles.alertDot} />
              <Text style={styles.alertTxt}>
                {counts.pending} MOU{counts.pending > 1 ? "s" : ""} awaiting your response
              </Text>
              <Ionicons name="chevron-forward" size={16} color={C.gold} />
            </TouchableOpacity>
          )}

          {/* Quick Actions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            {[
              { icon: "document-text", label: "MOU\nManagement", screen: "MoUs", color: C.teal, bg: "#E0F7F7" },
              { icon: "briefcase",     label: "Post\nInternship", screen: "InternshipsMain", color: "#7C3AED", bg: "#F3F0FF" },
              { icon: "flask",         label: "Add\nProject",     screen: "ManageProjects", color: "#0284C7", bg: "#E0F2FE" },
              { icon: "chatbubbles",   label: "Messages",         screen: "MessagesMain", color: "#D97706", bg: "#FEF3C7" },
              { icon: "sparkles",      label: "CXbot\nAI",        screen: "AIChatbot", color: C.navy, bg: C.border },
              { icon: "person",        label: "Profile",          screen: "Profile", color: "#059669", bg: "#D1FAE5" },
            ].map((a, i) => (
              <TouchableOpacity key={i} style={styles.actionTile} onPress={() => nav.navigate(a.screen)} activeOpacity={0.82}>
                <View style={[styles.actionTileIcon, { backgroundColor: a.bg }]}>
                  <Ionicons name={a.icon} size={26} color={a.color} />
                </View>
                <Text style={styles.actionTileLbl}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent MOUs */}
          {recentMous.length > 0 && (
            <>
              <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                <Text style={styles.sectionTitle}>Recent MOUs</Text>
                <TouchableOpacity onPress={() => nav.navigate("MoUs")}>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>
              {recentMous.map((m) => (
                <TouchableOpacity key={m._id} style={styles.recentMouCard}
                  onPress={() => nav.navigate("MouDetail", { mouId: m._id })} activeOpacity={0.85}>
                  <View style={styles.recentMouLeft}>
                    <Text style={styles.recentMouTitle} numberOfLines={1}>{m.title || m.university}</Text>
                    <Text style={styles.recentMouSub} numberOfLines={1}>{m.collaborationType}</Text>
                    <Text style={styles.recentMouDate}>{fmtDate(m.endDate)}</Text>
                  </View>
                  <SBadge status={m.status} />
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Company Card */}
          <View style={styles.companyCard}>
            <View style={styles.companyCardLeft}>
              <View style={styles.companyLogoBox}>
                {user?.logo
                  ? <Image source={{ uri: user.logo }} style={styles.companyLogoImg} />
                  : <Text style={styles.companyLogoTxt}>{initials(user?.name || "CX")}</Text>}
              </View>
              <View>
                <Text style={styles.companyCardName}>{user?.name}</Text>
                <Text style={styles.companyCardSub}>{user?.industry}</Text>
                {user?.address && <Text style={styles.companyCardAddr}>📍 {user.address}</Text>}
              </View>
            </View>
            <TouchableOpacity onPress={() => nav.navigate("Profile")} style={styles.editProfileBtn}>
              <Ionicons name="pencil" size={14} color={C.teal} />
              <Text style={styles.editProfileTxt}>Edit</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PROFILE SCREEN
//  FIX: "back" prop hata diya — drawer screen hai, stack nahi
//  FIX: Custom back button jo Dashboard pe le jaata hai
// ═══════════════════════════════════════════════════════════════
function ProfileScreen() {
  const nav = useNavigation();
  const { user, updateUser, ax } = useUser();
  const toast = useToast();
  const [ld, setLd] = useState(false);
  const [form, setForm] = useState({ ...user });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permission needed", "Camera roll access required."); return; }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!res.canceled) {
      const newLogo = res.assets[0].uri;
      setForm((f) => ({ ...f, logo: newLogo }));
      updateUser({ logo: newLogo });
    }
  };

  const save = async () => {
    setLd(true);
    try {
      try { await ax().put(`${BASE}/api/industry/auth/profile`, form); } catch {}
      updateUser(form);
      toast("Profile updated!", "success");
    } catch { toast("Update failed", "error"); }
    finally { setLd(false); }
  };

  const initials = (n) => n?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "CX";

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* FIX: Custom header with drawer-aware back button */}
      <View style={styles.hdr}>
        <TouchableOpacity onPress={() => nav.navigate("Dashboard")} style={styles.hdrBtn}>
          <Ionicons name="arrow-back" size={24} color={C.navy} />
        </TouchableOpacity>
        <Text style={styles.hdrTitle} numberOfLines={1}>Company Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Profile Header */}
        <View style={styles.profBanner}>
          <TouchableOpacity onPress={pickImage} style={styles.profAvatarWrap}>
            {form.logo
              ? <Image source={{ uri: form.logo }} style={styles.profAvatarImg} />
              : <Text style={styles.profAvatarTxt}>{initials(form.name)}</Text>}
            <View style={styles.profCamBtn}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profName}>{form.name}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={12} color={C.teal} />
            <Text style={styles.verifiedTxt}>Verified Partner</Text>
          </View>
        </View>

        <View style={styles.profForm}>
          <Text style={styles.profSection}>Company Info</Text>
          {[
            { lbl: "Company Name", key: "name" },
            { lbl: "Industry Sector", key: "industry" },
            { lbl: "Website", key: "website", kbType: "url" },
            { lbl: "Address", key: "address" },
          ].map(f => (
            <View key={f.key} style={styles.fieldWrap}>
              <Text style={styles.fieldLbl}>{f.lbl}</Text>
              <TextInput style={styles.fieldInput} value={(form)[f.key]}
                onChangeText={(v) => setForm((x) => ({ ...x, [f.key]: v }))}
                keyboardType={(f).kbType || "default"} />
            </View>
          ))}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLbl}>About Us</Text>
            <TextInput style={[styles.fieldInput, { height: 90, textAlignVertical: "top" }]}
              value={form.about} onChangeText={(v) => setForm((x) => ({ ...x, about: v }))} multiline />
          </View>

          <Text style={[styles.profSection, { marginTop: 20 }]}>Contact</Text>
          {[
            { lbl: "Email", key: "email", kbType: "email-address" },
            { lbl: "Phone", key: "phone", kbType: "phone-pad" },
          ].map(f => (
            <View key={f.key} style={styles.fieldWrap}>
              <Text style={styles.fieldLbl}>{f.lbl}</Text>
              <TextInput style={styles.fieldInput} value={(form)[f.key]}
                onChangeText={(v) => setForm((x) => ({ ...x, [f.key]: v }))}
                keyboardType={(f).kbType || "default"} autoCapitalize="none" />
            </View>
          ))}

          <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={ld}>
            {ld ? <ActivityIndicator color="#fff" /> : (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.saveBtnTxt}>Save Changes</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MOU LIST
//  FIX: industryId aur industry params ab backend ko bheje ja rahe hain
// ═══════════════════════════════════════════════════════════════
function MoUScreen() {
  const nav = useNavigation();
  // FIX: user add kiya taake industryId/name bhej sakein
  const { ax, user } = useUser();
  const [mous, setMous] = useState([]);
  const [ld, setLd] = useState(true);
  const [ref, setRef] = useState(false);
  const [filter, setFilter] = useState("All");

  const load = useCallback(async (show = true) => {
    if (show) setLd(true);
    try {
      // FIX: params bhejo taake sirf apni company ke MOUs aayein
      const r = await ax().get(`${API_MOU}/mine`, {
        params: {
          industryId: user?._id,
          industry: user?.name
        }
      });
      setMous(r.data || []);
    }
    catch (e) {
      console.log("MOU load error:", e?.response?.data || e.message);
    }
    finally { setLd(false); setRef(false); }
  }, [ax, user]);

  useEffect(() => { load(); }, []);

  const filtered = filter === "All" ? mous :
    mous.filter(m => filter === "Pending" ? ["Sent to Industry Laison Incharge", "Changes Proposed"].includes(m.status) :
      filter === "Approved" ? m.status === "Mutually Approved" : m.status === filter);

  const tabs = ["All", "Pending", "Approved", "Rejected"];

  if (ld) return <View style={styles.center}><ActivityIndicator color={C.teal} size="large" /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="MOU Management"
        right={
          <TouchableOpacity onPress={() => nav.navigate("CreateMoU")} style={styles.hdrAction}>
            <Ionicons name="add" size={22} color={C.white} />
          </TouchableOpacity>
        }
        back
      />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {tabs.map(t => (
          <TouchableOpacity key={t} onPress={() => setFilter(t)}
            style={[styles.filterTab, filter === t && styles.filterTabActive]}>
            <Text style={[styles.filterTabTxt, filter === t && styles.filterTabTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={m => m._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={ref} onRefresh={() => { setRef(true); load(false); }} tintColor={C.teal} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={56} color={C.textLight} />
            <Text style={styles.emptyTitle}>No MOUs yet</Text>
            <Text style={styles.emptySub}>Tap + to request a new MOU</Text>
          </View>
        }
        renderItem={({ item: m }) => {
          const needsAction = ["Sent to Industry Laison Incharge", "Changes Proposed"].includes(m.status);
          return (
            <TouchableOpacity
              style={[styles.mouListCard, needsAction && styles.mouListCardUrgent]}
              onPress={() => nav.navigate("MouDetail", { mouId: m._id })}
              activeOpacity={0.85}>
              {needsAction && (
                <View style={styles.urgentBanner}>
                  <Ionicons name="flash" size={11} color={C.gold} />
                  <Text style={styles.urgentTxt}>Action Required</Text>
                </View>
              )}
              {m.status === "Mutually Approved" && (
                <View style={[styles.urgentBanner, { backgroundColor: "#dcfce7" }]}>
                  <Ionicons name="checkmark-circle" size={11} color="#16a34a" />
                  <Text style={[styles.urgentTxt, { color: "#16a34a" }]}>Mutually Approved</Text>
                </View>
              )}
              <View style={styles.mouListHead}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.mouListTitle} numberOfLines={1}>{m.title || m.university}</Text>
                  <Text style={styles.mouListSub}>{m.university} · {m.collaborationType}</Text>
                </View>
                <SBadge status={m.status} />
              </View>
              <View style={styles.mouListFooter}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="calendar-outline" size={12} color={C.textLight} />
                  <Text style={styles.mouListDate}>{fmtDate(m.startDate)} → {fmtDate(m.endDate)}</Text>
                </View>
                {(m.scheduledMeeting?.confirmedSlot?.date || m.meetingConfirmedSlot?.date) && (
                  <View style={styles.mtgConfirmedChip}>
                    <Ionicons name="checkmark-circle" size={10} color="#16a34a" />
                    <Text style={styles.mtgConfirmedTxt}>Meeting set</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CREATE MOU
// ═══════════════════════════════════════════════════════════════
function CreateMoUScreen() {
  const nav = useNavigation();
  const { user, ax } = useUser();
  const toast = useToast();
  const [ld, setLd] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "", collaborationType: "", description: "",
    objectives: [""], terms: [""],
    startDate: "", endDate: "",
    signatories: { industry: "" },
    industryContact: { name: "", designation: "", email: "" },
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const arrAdd = (k) => setForm((f) => ({ ...f, [k]: [...f[k], ""] }));
  const arrUpd = (k, i, v) => setForm((f) => { const a = [...f[k]]; a[i] = v; return { ...f, [k]: a }; });

  const submit = async () => {
    if (!form.title || !form.collaborationType) {
      Alert.alert("Missing Information", "Please enter Title and Collaboration Type.");
      return;
    }

    setLd(true);
    try {
      const payload = {
        title: form.title,
        university: "Riphah International University",
        industry: user?.name || "New Industry Partner",
        industryId: user?._id || "industry_001",
        collaborationType: form.collaborationType,
        description: form.description || "",
        startDate: form.startDate || new Date().toISOString().split('T')[0],
        endDate: form.endDate || new Date(Date.now() + 31536000000).toISOString().split('T')[0],
        objectives: form.objectives.filter(Boolean),
        terms: form.terms.filter(Boolean),
        industryContact: form.industryContact,
        signatories: form.signatories,
        status: "Draft",
        changeLog: [{
          id: Date.now(),
          type: "industry_change",
          date: new Date().toISOString(),
          party: "Industry",
          message: `MOU Request created by ${user?.name}`
        }]
      };

      const response = await ax().post(API_MOU, payload);

      if (response.status === 201 || response.status === 200) {
        toast("MOU request sent successfully!", "success");
        nav.goBack();
      }
    } catch (e) {
      console.log("Full Error Object:", e.response?.data);
      const errorMsg = e.response?.data?.message || "Server connection failed. Check your IP address.";
      Alert.alert("Creation Failed", errorMsg);
    } finally {
      setLd(false);
    }
  };

  const TYPES = ["Research", "Internship", "Training", "Consultancy", "Joint Venture", "Other"];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Request New MOU" back />

      {/* Step Indicator */}
      <View style={styles.stepRow}>
        {[1, 2, 3].map(s => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, step >= s && styles.stepDotActive]}>
              {step > s ? <Ionicons name="checkmark" size={12} color="#fff" /> :
                <Text style={[styles.stepNum, step >= s && { color: "#fff" }]}>{s}</Text>}
            </View>
            <Text style={[styles.stepLbl, step >= s && { color: C.teal }]}>
              {s === 1 ? "Basics" : s === 2 ? "Details" : "Review"}
            </Text>
            {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.createForm}>

          {step === 1 && (
            <>
              <Text style={styles.stepHeading}>Basic Information</Text>
              <FieldInput label="MOU Title *" value={form.title} onChange={v => set("title", v)} placeholder="e.g. AI Research Collaboration" />
              <FieldInput label="University" value="Riphah International University" onChange={() => {}} editable={false} />

              <Text style={styles.fieldLbl}>Collaboration Type *</Text>
              <View style={styles.typeGrid}>
                {TYPES.map(t => (
                  <TouchableOpacity key={t} onPress={() => set("collaborationType", t)}
                    style={[styles.typeChip, form.collaborationType === t && styles.typeChipActive]}>
                    <Text style={[styles.typeChipTxt, form.collaborationType === t && styles.typeChipTxtActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <FieldInput label="Start Date" value={form.startDate} onChange={v => set("startDate", v)} placeholder="YYYY-MM-DD" />
              <FieldInput label="End Date" value={form.endDate} onChange={v => set("endDate", v)} placeholder="YYYY-MM-DD" />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.stepHeading}>Purpose & Objectives</Text>
              <FieldInput label="Description / Purpose *" value={form.description} onChange={v => set("description", v)}
                placeholder="Describe the purpose and scope..." multiline />

              <Text style={styles.fieldLbl}>Objectives</Text>
              {form.objectives.map((o, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <View style={styles.objNum}><Text style={styles.objNumTxt}>{i + 1}</Text></View>
                  <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} value={o}
                    onChangeText={(v) => arrUpd("objectives", i, v)} placeholder={`Objective ${i + 1}`} />
                </View>
              ))}
              <TouchableOpacity onPress={() => arrAdd("objectives")} style={styles.addRowBtn}>
                <Ionicons name="add-circle-outline" size={16} color={C.teal} />
                <Text style={styles.addRowTxt}>Add Objective</Text>
              </TouchableOpacity>

              <Text style={[styles.fieldLbl, { marginTop: 16 }]}>Terms & Conditions</Text>
              {form.terms.map((t, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <View style={styles.objNum}><Text style={styles.objNumTxt}>{i + 1}</Text></View>
                  <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} value={t}
                    onChangeText={(v) => arrUpd("terms", i, v)} placeholder={`Term ${i + 1}`} />
                </View>
              ))}
              <TouchableOpacity onPress={() => arrAdd("terms")} style={styles.addRowBtn}>
                <Ionicons name="add-circle-outline" size={16} color={C.teal} />
                <Text style={styles.addRowTxt}>Add Term</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.stepHeading}>Contact & Review</Text>
              <FieldInput label="Your Contact Name" value={form.industryContact.name}
                onChange={v => set("industryContact", { ...form.industryContact, name: v })} />
              <FieldInput label="Designation" value={form.industryContact.designation}
                onChange={v => set("industryContact", { ...form.industryContact, designation: v })} />
              <FieldInput label="Contact Email" value={form.industryContact.email}
                onChange={v => set("industryContact", { ...form.industryContact, email: v })} kbType="email-address" />
              <FieldInput label="Authorized Signatory" value={form.signatories.industry}
                onChange={v => set("signatories", { ...form.signatories, industry: v })} placeholder="Name & Designation" />

              {/* Summary */}
              <View style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>Summary</Text>
                {[
                  { l: "Title",      v: form.title },
                  { l: "Type",       v: form.collaborationType },
                  { l: "Duration",   v: `${form.startDate || "—"} → ${form.endDate || "—"}` },
                  { l: "University", v: "Riphah International University" },
                  { l: "Industry",   v: user?.name },
                ].map(r => (
                  <View key={r.l} style={styles.reviewRow}>
                    <Text style={styles.reviewLbl}>{r.l}</Text>
                    <Text style={styles.reviewVal}>{r.v || "—"}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.stepBtns}>
            {step > 1 && (
              <TouchableOpacity style={styles.backStepBtn} onPress={() => setStep(s => s - 1)}>
                <Ionicons name="arrow-back" size={16} color={C.teal} />
                <Text style={styles.backStepTxt}>Back</Text>
              </TouchableOpacity>
            )}
            {step < 3 ? (
              <TouchableOpacity style={[styles.nextStepBtn, { flex: 1 }]} onPress={() => setStep(s => s + 1)}>
                <Text style={styles.nextStepTxt}>Continue</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.nextStepBtn, { flex: 1, backgroundColor: C.teal }]} onPress={submit} disabled={ld}>
                {ld ? <ActivityIndicator color="#fff" size="small" /> : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="send" size={16} color="#fff" />
                    <Text style={styles.nextStepTxt}>Submit Request</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MOU DETAIL
// ═══════════════════════════════════════════════════════════════
function MouDetailScreen({ route }) {
  const { ax } = useUser();
  const toast = useToast();
  const [mou, setMou] = useState(null);
  const [ld, setLd] = useState(true);
  const [actLd, setActLd] = useState(false);
  const [tab, setTab] = useState("details");
  const [respModal, setRespModal] = useState(false);
  const [mtgModal, setMtgModal] = useState(false);
  const mouId = route.params?.mouId;

  useEffect(() => {
    ax().get(`${API_MOU}/${mouId}`)
      .then(r => setMou(r.data))
      .catch(() => {})
      .finally(() => setLd(false));
  }, [mouId]);

  const upd = (u) => setMou(u);

  const doResponse = async (rd) => {
    setActLd(true);
    try {
      const lt = rd.type === "accept" ? "industry_approve" : rd.type === "reject" ? "industry_reject" :
        rd.type === "change" ? "industry_change" : "industry_response";
      const cl = addCL(mou, lt, { party: "Industry", from: mou.industry, message: rd.message });
      let ns = mou.status;
      if (rd.type === "accept") ns = "Approved by Industry";
      else if (rd.type === "reject") ns = "Rejected";
      else if (rd.type === "change") ns = "Changes Proposed";
      else ns = "Industry Responded";
      const stamp = rd.type === "accept" ? { by: mou.industry, type: "approve", date: new Date().toISOString() } : mou.industryStamp;
      const pl = { ...bldPayload(mou), status: ns, changeLog: cl, industryStamp: stamp,
        industryResponseAt: new Date().toISOString(),
        proposedChanges: rd.changes ? [...(mou.proposedChanges || []), ...rd.changes] : (mou.proposedChanges || []) };
      const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
      upd(r.data); setRespModal(false);
      toast(rd.type === "accept" ? "🎉 MOU Approved!" : rd.type === "reject" ? "MOU Rejected" : "Response sent!",
        rd.type === "reject" ? "error" : "success");
    } catch (e) {
      const detailedError = JSON.stringify(e.response?.data) || e.message;
      console.log("Error Details:", detailedError);
      Alert.alert("Server Error", detailedError);
      toast("Action failed", "error");
    }
    finally { setActLd(false); }
  };

  const selectSlot = async (opt) => {
    const sl = { date: opt.date || "", time: opt.time || "", note: opt.note || "" };
    const now = new Date().toISOString();
    setActLd(true);
    try {
      const cl = addCL(mou, "meeting_confirmed", { party: "Industry", from: mou.industry, message: `Confirmed: ${sl.date} at ${sl.time}` });
      const updMtg = { ...mou.scheduledMeeting, confirmedSlot: sl, confirmedAt: now, industryProposedSlot: null };
      const pl = { ...bldPayload(mou), scheduledMeeting: updMtg, changeLog: cl };
      const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
      upd({ ...r.data, scheduledMeeting: updMtg });
      toast(`🤝 Meeting confirmed: ${sl.date}!`, "success");
    } catch (e) { toast(e?.response?.data?.message || "Error", "error"); }
    finally { setActLd(false); }
  };

  const proposeSlot = async (sd) => {
    const prop = { date: sd.date || "", time: sd.time || "", note: sd.note || "" };
    const now = new Date().toISOString();
    setActLd(true);
    try {
      const cl = addCL(mou, "meeting_proposed", { party: "Industry", from: mou.industry, message: `Proposed: ${prop.date} at ${prop.time}` });
      const updMtg = { ...mou.scheduledMeeting, industryProposedSlot: prop, industryProposedAt: now, confirmedSlot: null };
      const pl = { ...bldPayload(mou), scheduledMeeting: updMtg, changeLog: cl };
      const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
      upd({ ...r.data, scheduledMeeting: updMtg });
      setMtgModal(false);
      toast("Slot proposed to University", "info");
    } catch (e) { toast(e?.response?.data?.message || "Error", "error"); }
    finally { setActLd(false); }
  };

  if (ld) return <View style={styles.center}><ActivityIndicator size="large" color={C.teal} /></View>;
  if (!mou) return <View style={{ flex: 1, backgroundColor: C.bg }}><Header title="MOU" back /></View>;

  const mtg = mou.scheduledMeeting;
  const cs = mtg?.confirmedSlot, hasC = !!(cs?.date);
  const ip = mtg?.industryProposedSlot, hasI = !!(ip?.date);
  const hasOpts = mtg?.options?.length > 0;
  const hasSingle = !hasOpts && mtg?.date && mtg?.time;
  const canResp = ["Sent to Industry Laison Incharge", "Changes Proposed"].includes(mou.status);
  const isMutual = mou.status === "Mutually Approved";

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title={mou.title || "MOU Detail"} back />

      {/* Status strip */}
      <View style={[styles.statusStrip, isMutual && { backgroundColor: "#f0fdf4", borderColor: "#86efac" }]}>
        <SBadge status={mou.status} />
        {isMutual && <Text style={{ fontSize: 13, color: "#16a34a", fontWeight: "700" }}>🎉 Fully Finalized</Text>}
        {canResp && (
          <TouchableOpacity style={styles.respBtn} onPress={() => setRespModal(true)} disabled={actLd}>
            <Ionicons name="chatbubble-ellipses" size={14} color="#fff" />
            <Text style={styles.respBtnTxt}>Respond</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {["details", "meeting", "activity"].map(t => (
          <TouchableOpacity key={t} style={[styles.tabItem, tab === t && styles.tabItemActive]} onPress={() => setTab(t)}>
            <Ionicons name={t === "details" ? "document-text-outline" : t === "meeting" ? "calendar-outline" : "time-outline"} size={15} color={tab === t ? C.teal : C.textLight} />
            <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>
              {t === "details" ? "Details" : t === "meeting" ? "Meeting" : "Activity"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>

        {tab === "details" && (
          <>
            <InfoCard icon="school-outline" title="Collaboration">
              <Row label="Type" val={mou.collaborationType} />
              <Row label="University" val={mou.university} />
              <Row label="Duration" val={`${fmtDate(mou.startDate)} → ${fmtDate(mou.endDate)}`} />
            </InfoCard>

            {mou.description && (
              <InfoCard icon="document-outline" title="Purpose">
                <Text style={styles.infoText}>{mou.description}</Text>
              </InfoCard>
            )}

            {mou.objectives?.filter(Boolean).length > 0 && (
              <InfoCard icon="list-outline" title="Objectives">
                {mou.objectives.filter(Boolean).map((o, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletTxt}>{o}</Text>
                  </View>
                ))}
              </InfoCard>
            )}

            {mou.proposedChanges?.length > 0 && (
              <View style={[styles.infoCardWrap, { borderLeftWidth: 3, borderLeftColor: C.purple }]}>
                <View style={styles.infoCardHead}>
                  <Ionicons name="alert-circle" size={16} color={C.purple} />
                  <Text style={[styles.infoCardTitle, { color: C.purple }]}>{mou.proposedChanges.length} Proposed Change(s)</Text>
                </View>
                {mou.proposedChanges.map((ch, i) => (
                  <View key={i} style={styles.changeRow}>
                    <Text style={styles.changeLbl}>{ch.field || `Change #${i + 1}`}</Text>
                    <Text style={styles.changeVals}>
                      <Text style={{ color: C.danger, textDecorationLine: "line-through" }}>{ch.oldValue}</Text>
                      {"  →  "}
                      <Text style={{ color: C.success }}>{ch.newValue}</Text>
                    </Text>
                    {ch.reason && <Text style={styles.changeReason}>Reason: {ch.reason}</Text>}
                  </View>
                ))}
              </View>
            )}

            {(mou.universityStamp || mou.industryStamp) && (
              <InfoCard icon="ribbon-outline" title="Approvals">
                {mou.universityStamp && (
                  <View style={styles.stampRow}>
                    <View style={[styles.stampDot, { backgroundColor: mou.universityStamp.type === "approve" ? C.success : C.danger }]} />
                    <View>
                      <Text style={styles.stampLbl}>University: {mou.universityStamp.type === "approve" ? "✅ Approved" : "❌ Rejected"}</Text>
                      <Text style={styles.stampDate}>By {mou.universityStamp.by} · {fmtDate(mou.universityStamp.date)}</Text>
                    </View>
                  </View>
                )}
                {mou.industryStamp && (
                  <View style={styles.stampRow}>
                    <View style={[styles.stampDot, { backgroundColor: mou.industryStamp.type === "approve" ? C.success : C.danger }]} />
                    <View>
                      <Text style={styles.stampLbl}>Industry: {mou.industryStamp.type === "approve" ? "✅ Approved" : "❌ Rejected"}</Text>
                      <Text style={styles.stampDate}>By {mou.industryStamp.by} · {fmtDate(mou.industryStamp.date)}</Text>
                    </View>
                  </View>
                )}
              </InfoCard>
            )}
          </>
        )}

        {tab === "meeting" && (
          <>
            {!mtg && (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={56} color={C.textLight} />
                <Text style={styles.emptyTitle}>No meeting scheduled</Text>
                <Text style={styles.emptySub}>University will propose a time slot</Text>
              </View>
            )}

            {mtg && hasC && (
              <View style={styles.confirmedCard}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <View style={styles.confirmedIcon}>
                    <Ionicons name="checkmark-circle" size={22} color="#fff" />
                  </View>
                  <Text style={styles.confirmedTitle}>Meeting Confirmed! 🎉</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={styles.dtCell}>
                    <Text style={styles.dtLabel}>DATE</Text>
                    <Text style={styles.dtVal}>{cs.date}</Text>
                  </View>
                  <View style={styles.dtCell}>
                    <Text style={styles.dtLabel}>TIME</Text>
                    <Text style={styles.dtVal}>🕐 {cs.time}</Text>
                  </View>
                </View>
                {mtg.venue && <Text style={styles.mtgMeta}>📍 {mtg.venue}</Text>}
                {mtg.agenda && <Text style={styles.mtgMeta}>📋 {mtg.agenda}</Text>}
                {cs.note && <Text style={styles.mtgMeta}>📌 {cs.note}</Text>}
                <Text style={styles.confirmedSince}>Confirmed · {fmtDT(mtg.confirmedAt)}</Text>
              </View>
            )}

            {mtg && !hasC && hasI && (
              <View style={styles.pendingCard}>
                <Text style={styles.pendingTitle}>⏳ Awaiting University Confirmation</Text>
                <Text style={styles.pendingSub}>You proposed:</Text>
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                  <View style={[styles.dtCell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}>
                    <Text style={[styles.dtLabel, { color: "#92400e" }]}>DATE</Text>
                    <Text style={[styles.dtVal, { color: "#92400e" }]}>{ip.date}</Text>
                  </View>
                  <View style={[styles.dtCell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}>
                    <Text style={[styles.dtLabel, { color: "#92400e" }]}>TIME</Text>
                    <Text style={[styles.dtVal, { color: "#92400e" }]}>🕐 {ip.time}</Text>
                  </View>
                </View>
                {ip.note && <Text style={{ fontSize: 12, color: "#a16207" }}>📌 {ip.note}</Text>}
                <TouchableOpacity style={styles.outlineBtn} onPress={() => setMtgModal(true)}>
                  <Ionicons name="pencil" size={13} color={C.teal} />
                  <Text style={styles.outlineTxt}>Change Slot</Text>
                </TouchableOpacity>
              </View>
            )}

            {mtg && !hasC && !hasI && hasOpts && (
              <>
                <View style={styles.infoNote}>
                  <Ionicons name="information-circle" size={16} color="#0284c7" />
                  <Text style={styles.infoNoteTxt}>Select a slot or propose your own time</Text>
                </View>
                {mtg.options.map((opt, i) => (
                  <View key={i} style={styles.slotCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.slotDate}>{opt.date} at {opt.time}</Text>
                      {opt.note && <Text style={styles.slotNote}>{opt.note}</Text>}
                    </View>
                    <TouchableOpacity style={styles.selectBtn} onPress={() => selectSlot(opt)} disabled={actLd}>
                      {actLd ? <ActivityIndicator color="#fff" size="small" /> : (
                        <><Ionicons name="checkmark" size={14} color="#fff" /><Text style={styles.selectTxt}>Select</Text></>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
                {mtg.venue && <Text style={[styles.mtgMeta, { marginTop: 8 }]}>📍 {mtg.venue}</Text>}
                {mtg.agenda && <Text style={styles.mtgMeta}>📋 {mtg.agenda}</Text>}
                <TouchableOpacity style={styles.outlineBtn} onPress={() => setMtgModal(true)}>
                  <Ionicons name="pencil" size={13} color={C.teal} />
                  <Text style={styles.outlineTxt}>Propose Different Slot</Text>
                </TouchableOpacity>
              </>
            )}

            {mtg && !hasC && !hasI && hasSingle && (
              <>
                <View style={styles.infoNote}>
                  <Ionicons name="information-circle" size={16} color="#0284c7" />
                  <Text style={styles.infoNoteTxt}>University proposed this time</Text>
                </View>
                <View style={styles.slotCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.slotDate}>{fmtDate(mtg.date)} at {mtg.time}</Text>
                    {mtg.venue && <Text style={styles.slotNote}>📍 {mtg.venue}</Text>}
                    {mtg.agenda && <Text style={styles.slotNote}>📋 {mtg.agenda}</Text>}
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                  <TouchableOpacity style={[styles.selectBtn, { flex: 1, justifyContent: "center", paddingVertical: 12 }]}
                    onPress={() => selectSlot({ date: mtg.date, time: mtg.time, note: "" })} disabled={actLd}>
                    {actLd ? <ActivityIndicator color="#fff" size="small" /> : (
                      <><Ionicons name="checkmark-circle" size={15} color="#fff" /><Text style={styles.selectTxt}>Confirm This Slot</Text></>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.outlineBtn, { flex: 1, justifyContent: "center" }]} onPress={() => setMtgModal(true)}>
                    <Ionicons name="pencil" size={13} color={C.teal} />
                    <Text style={styles.outlineTxt}>Propose New</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}

        {tab === "activity" && (
          <>
            {hasC && (
              <View style={[styles.confirmedCard, { marginBottom: 16 }]}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#166534", marginBottom: 8 }}>✅ Meeting Confirmed</Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={styles.dtCell}><Text style={styles.dtLabel}>DATE</Text><Text style={styles.dtVal}>{cs.date}</Text></View>
                  <View style={styles.dtCell}><Text style={styles.dtLabel}>TIME</Text><Text style={styles.dtVal}>🕐 {cs.time}</Text></View>
                </View>
              </View>
            )}

            <Text style={styles.actSection}>Timeline</Text>
            {[
              { lbl: "Draft Created",     date: mou.createdAt,          done: true },
              { lbl: "Sent to Industry Laison Incharge",  date: mou.sentAt,             done: !!mou.sentAt },
              { lbl: "Our Response",      date: mou.industryResponseAt, done: !!mou.industryResponseAt },
              { lbl: "Meeting Confirmed", date: mtg?.confirmedAt,       done: hasC },
              { lbl: "Mutually Approved", date: null,                   done: isMutual },
            ].map((t, i) => (
              <View key={i} style={styles.tlRow}>
                <View style={[styles.tlDot, { backgroundColor: t.done ? C.success : C.border }]}>
                  {t.done && <Ionicons name="checkmark" size={10} color="#fff" />}
                </View>
                <View style={styles.tlLine} />
                <View>
                  <Text style={[styles.tlLbl, { color: t.done ? C.text : C.textLight }]}>{t.lbl}</Text>
                  {t.date && <Text style={styles.tlDate}>{fmtDate(t.date)}</Text>}
                </View>
              </View>
            ))}

            {(mou.changeLog || []).length > 0 && (
              <>
                <Text style={[styles.actSection, { marginTop: 20 }]}>All Activity</Text>
                {[...(mou.changeLog || [])].reverse().map((e, i) => {
                  const ct = CT[e.type] || { c: C.textLight, bg: C.bg, ic: "📌", lbl: e.type };
                  return (
                    <View key={e.id || i} style={[styles.logCard, { backgroundColor: ct.bg, borderColor: ct.c + "30" }]}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <Text style={{ fontSize: 14 }}>{ct.ic}</Text>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: ct.c }}>{ct.lbl}</Text>
                        <Text style={{ marginLeft: "auto", fontSize: 10, color: C.textLight }}>{e.party}</Text>
                      </View>
                      {e.message && <Text style={{ fontSize: 12, color: C.text, lineHeight: 18 }}>{e.message}</Text>}
                      <Text style={{ fontSize: 10, color: C.textLight, marginTop: 4 }}>{fmtDT(e.date)}</Text>
                    </View>
                  );
                })}
              </>
            )}
          </>
        )}
      </ScrollView>

      <RespModal    visible={respModal} mou={mou} onClose={() => setRespModal(false)} onSave={doResponse} loading={actLd} />
      <PropMtgModal visible={mtgModal}  mou={mou} onClose={() => setMtgModal(false)}  onSave={proposeSlot} loading={actLd} />
    </View>
  );
}

// ─── Response Modal ───────────────────────────────────────────
const RespModal = ({ visible, mou, onClose, onSave, loading }) => {
  const [type, setType] = useState("comment");
  const [msg,  setMsg]  = useState("");
  const [changes, setChanges] = useState([{ field: "", oldValue: "", newValue: "", reason: "" }]);

  const cfg = {
    accept:  { c: "#16a34a", bg: "#f0fdf4", lbl: "Accept MOU",      icon: "thumbs-up-outline" },
    reject:  { c: "#dc2626", bg: "#fef2f2", lbl: "Reject MOU",      icon: "thumbs-down-outline" },
    comment: { c: "#0284c7", bg: "#eff6ff", lbl: "Comment",         icon: "chatbubble-outline" },
    change:  { c: "#7c3aed", bg: "#f5f3ff", lbl: "Propose Changes", icon: "git-pull-request-outline" },
  };

  const submit = () => {
    if (!msg.trim() && type !== "accept" && type !== "reject") { Alert.alert("Required", "Enter a message."); return; }
    onSave({ type, message: msg || (type === "accept" ? `${mou?.industry} accepted.` : `${mou?.industry} rejected.`),
      changes: type === "change" ? changes.filter(c => c.field).map(c => ({ ...c, date: new Date().toISOString() })) : undefined });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>Respond to MOU</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.text} /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
            <Text style={styles.fieldLbl}>Response Type</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 16 }}>
              {Object.keys(cfg).map(k => (
                <TouchableOpacity key={k}
                  style={[styles.respTypeBtn, type === k && { borderColor: cfg[k].c, backgroundColor: cfg[k].bg }]}
                  onPress={() => setType(k)}>
                  <Ionicons name={cfg[k].icon} size={14} color={type === k ? cfg[k].c : C.textLight} />
                  <Text style={[styles.respTypeTxt, type === k && { color: cfg[k].c }]}>{cfg[k].lbl}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <FieldInput label={type === "accept" ? "Acceptance Note (optional)" : "Message *"}
              value={msg} onChange={setMsg}
              placeholder={type === "accept" ? "e.g. We accept as presented." : type === "reject" ? "Reason for rejection..." : "Your message..."} multiline />

            {type === "change" && (
              <>
                <Text style={[styles.fieldLbl, { color: C.purple, marginTop: 8 }]}>Proposed Changes</Text>
                {changes.map((ch, i) => (
                  <View key={i} style={styles.changeBlock}>
                    <TextInput style={styles.fieldInput} placeholder="Field / Section" value={ch.field}
                      onChangeText={v => { const a = [...changes]; a[i].field = v; setChanges(a); }} />
                    <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                      <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} placeholder="Current value"
                        value={ch.oldValue} onChangeText={v => { const a = [...changes]; a[i].oldValue = v; setChanges(a); }} />
                      <TextInput style={[styles.fieldInput, { flex: 1, marginTop: 0 }]} placeholder="New value"
                        value={ch.newValue} onChangeText={v => { const a = [...changes]; a[i].newValue = v; setChanges(a); }} />
                    </View>
                    <TextInput style={[styles.fieldInput, { marginTop: 6 }]} placeholder="Reason for change"
                      value={ch.reason} onChangeText={v => { const a = [...changes]; a[i].reason = v; setChanges(a); }} />
                  </View>
                ))}
                <TouchableOpacity onPress={() => setChanges(c => [...c, { field: "", oldValue: "", newValue: "", reason: "" }])}>
                  <Text style={{ color: C.purple, fontWeight: "700", textAlign: "center", marginTop: 4 }}>+ Add Change</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
          <View style={styles.sheetFoot}>
            <TouchableOpacity onPress={onClose} style={{ paddingHorizontal: 16, justifyContent: "center" }}>
              <Text style={{ color: C.textLight, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, { flex: 1, backgroundColor: cfg[type].c }]} onPress={submit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> :
                <Text style={styles.saveBtnTxt}>Submit Response</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Propose Meeting Modal ────────────────────────────────────
const PropMtgModal = ({ visible, mou, onClose, onSave, loading }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const mtg = mou?.scheduledMeeting;

  const useOpt = (o) => { setDate(o.date || ""); setTime(o.time || ""); setNote(o.note || ""); };

  const submit = () => {
    if (!date || !time) { Alert.alert("Required", "Enter date and time."); return; }
    onSave({ date, time, note });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>Propose Meeting Slot</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.text} /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
            <View style={styles.infoNote}>
              <Ionicons name="information-circle" size={16} color="#0284c7" />
              <Text style={styles.infoNoteTxt}>University will review and confirm your proposed slot.</Text>
            </View>

            {mtg?.options?.length > 0 && (
              <>
                <Text style={[styles.fieldLbl, { marginTop: 12 }]}>University's options (tap to use):</Text>
                {mtg.options.map((o, i) => (
                  <TouchableOpacity key={i} style={styles.optRow} onPress={() => useOpt(o)}>
                    <Text style={styles.optTxt}>{o.date} at {o.time}</Text>
                    <Text style={{ color: C.teal, fontWeight: "700", fontSize: 12 }}>Use</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
            {mtg?.date && !mtg?.options?.length && (
              <TouchableOpacity style={styles.optRow} onPress={() => useOpt({ date: mtg.date, time: mtg.time })}>
                <Text style={styles.optTxt}>{fmtDate(mtg.date)} at {mtg.time}</Text>
                <Text style={{ color: C.teal, fontWeight: "700", fontSize: 12 }}>Use</Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.fieldLbl, { marginTop: 16 }]}>Your Preferred Slot:</Text>
            <FieldInput label="Date (YYYY-MM-DD) *" value={date} onChange={setDate} placeholder="e.g. 2025-08-15" />
            <FieldInput label="Time (HH:MM) *" value={time} onChange={setTime} placeholder="e.g. 10:00" />
            <FieldInput label="Note (optional)" value={note} onChange={setNote} placeholder="e.g. Prefer morning" />
          </ScrollView>
          <View style={styles.sheetFoot}>
            <TouchableOpacity onPress={onClose} style={{ paddingHorizontal: 16, justifyContent: "center" }}>
              <Text style={{ color: C.textLight, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, { flex: 1 }]} onPress={submit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> : (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="send" size={14} color="#fff" />
                  <Text style={styles.saveBtnTxt}>Submit to University</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════
//  INTERNSHIPS
// ═══════════════════════════════════════════════════════════════
function InternshipsMainScreen() {
  const nav = useNavigation();
  const { ax } = useUser();
  const [items, setItems] = useState([]);
  const [ld, setLd] = useState(true);
  useEffect(() => { ax().get(API_INT).then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLd(false)); }, []);
  if (ld) return <View style={styles.center}><ActivityIndicator color={C.teal} /></View>;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Internships" back />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <TouchableOpacity style={styles.createBtn} onPress={() => nav.navigate("PostNewInternship")}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.createBtnTxt}>Post New Internship</Text>
        </TouchableOpacity>
        {items.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={56} color={C.textLight} />
            <Text style={styles.emptyTitle}>No internships yet</Text>
          </View>
        )}
        {items.map((item) => (
          <View key={item._id || item.id} style={styles.listCard}>
            <Text style={styles.listCardTitle}>{item.title}</Text>
            <Text style={styles.listCardSub}>{item.company}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={styles.listCardMeta}>Posted: {fmtDate(item.date || item.createdAt)}</Text>
              <Text style={styles.listCardMeta}>{item.applications || 0} Applicants</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function PostNewInternshipScreen() {
  const nav = useNavigation();
  const { user, ax } = useUser();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [desc, setDesc] = useState("");
  const [ld, setLd] = useState(false);
  const submit = async () => {
    if (!title) { toast("Title required", "error"); return; }
    setLd(true);
    try {
      await ax().post(API_INT, { title, company: user?.name || "", skills, description: desc });
      toast("Internship posted!", "success"); nav.goBack();
    } catch (e) { toast(e?.response?.data?.message || "Error", "error"); }
    finally { setLd(false); }
  };
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="New Internship" back />
      <ScrollView contentContainerStyle={styles.formPad}>
        <FieldInput label="Job Title *" value={title} onChange={setTitle} placeholder="e.g. React Developer" />
        <FieldInput label="Required Skills" value={skills} onChange={setSkills} placeholder="e.g. JavaScript, React" />
        <FieldInput label="Description" value={desc} onChange={setDesc} placeholder="Responsibilities..." multiline />
        <TouchableOpacity style={[styles.saveBtn, { marginTop: 24 }]} onPress={submit} disabled={ld}>
          {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnTxt}>Publish Internship</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PROJECTS
// ═══════════════════════════════════════════════════════════════
function ManageProjectsScreen() {
  const nav = useNavigation();
  const { ax } = useUser();
  const [items, setItems] = useState([]);
  const [ld, setLd] = useState(true);
  useEffect(() => { ax().get(API_PROJ).then(r => setItems(r.data || [])).catch(() => {}).finally(() => setLd(false)); }, []);
  if (ld) return <View style={styles.center}><ActivityIndicator color={C.teal} /></View>;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Projects" back />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <TouchableOpacity style={styles.createBtn} onPress={() => nav.navigate("PostNewProject")}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.createBtnTxt}>Add New Project</Text>
        </TouchableOpacity>
        {items.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="flask-outline" size={56} color={C.textLight} />
            <Text style={styles.emptyTitle}>No projects yet</Text>
          </View>
        )}
        {items.map((item) => (
          <View key={item._id || item.id} style={styles.listCard}>
            <Text style={styles.listCardTitle}>{item.title}</Text>
            <Text style={styles.listCardSub}>{item.type}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function PostNewProjectScreen() {
  const nav = useNavigation();
  const { ax } = useUser();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Research");
  const [desc, setDesc] = useState("");
  const [ld, setLd] = useState(false);
  const submit = async () => {
    if (!title) { toast("Title required", "error"); return; }
    setLd(true);
    try {
      await ax().post(API_PROJ, { title, type, description: desc });
      toast("Project added!", "success"); nav.goBack();
    } catch (e) { toast(e?.response?.data?.message || "Error", "error"); }
    finally { setLd(false); }
  };
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="New Project" back />
      <ScrollView contentContainerStyle={styles.formPad}>
        <FieldInput label="Project Title *" value={title} onChange={setTitle} />
        <Text style={styles.fieldLbl}>Type</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 12 }}>
          {["Research", "Development", "Collaboration"].map(t => (
            <TouchableOpacity key={t} onPress={() => setType(t)}
              style={[styles.typeChip, type === t && styles.typeChipActive]}>
              <Text style={[styles.typeChipTxt, type === t && styles.typeChipTxtActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FieldInput label="Description" value={desc} onChange={setDesc} multiline />
        <TouchableOpacity style={[styles.saveBtn, { marginTop: 24 }]} onPress={submit} disabled={ld}>
          {ld ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnTxt}>Save Project</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MESSAGES
// ═══════════════════════════════════════════════════════════════
function MessagesScreen() {
  const nav = useNavigation();
  const chats = [
    { id: 1, name: "Internship Incharge", sub: "Riphah International University", time: "10:30 AM", msg: "Research grant approved.", avatar: "https://ui-avatars.com/api/?name=II&background=0F2236&color=fff&bold=true", unread: 2 },
    { id: 2, name: "Industry Liaison",     sub: "Riphah International University", time: "Yesterday", msg: "When can we meet?", avatar: "https://ui-avatars.com/api/?name=IL&background=0D7377&color=fff&bold=true", unread: 0 },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Messages" back />
      <FlatList data={chats} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => nav.navigate("ChatScreen", { contact: item })}>
            <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>{item.time}</Text>
              </View>
              <Text style={styles.chatSub}>{item.sub}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[styles.chatMsg, item.unread > 0 && { fontWeight: "700", color: C.text }]} numberOfLines={1}>{item.msg}</Text>
                {item.unread > 0 && <View style={styles.unreadDot}><Text style={styles.unreadNum}>{item.unread}</Text></View>}
              </View>
            </View>
          </TouchableOpacity>
        )} />
    </View>
  );
}

function ChatScreen({ route }) {
  const nav = useNavigation();
  const { contact } = route.params || { contact: { name: "University", avatar: "https://ui-avatars.com/api/?name=U" } };
  const [messages, setMessages] = useState([{ id: 1, text: "Hello! How can we help?", sender: "them", time: "10:00" }]);
  const [input, setInput] = useState("");
  const flatRef = useRef(null);
  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(p => [...p, { id: Date.now(), text: input, sender: "me", time: now }]);
    setInput("");
    setTimeout(() => setMessages(p => [...p, { id: Date.now() + 1, text: "Sure, let me check.", sender: "them", time: now }]), 1500);
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={styles.chatHdr}>
        <TouchableOpacity onPress={() => nav.goBack()}><Ionicons name="arrow-back" size={24} color={C.navy} /></TouchableOpacity>
        <Image source={{ uri: contact.avatar }} style={styles.chatHdrAvt} />
        <View><Text style={styles.chatHdrName}>{contact.name}</Text><Text style={{ fontSize: 11, color: C.success }}>Online</Text></View>
      </View>
      <FlatList ref={flatRef} data={messages} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatRef.current?.scrollToEnd()}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === "me" ? styles.bubbleMe : styles.bubbleThem]}>
            <Text style={{ color: item.sender === "me" ? "#fff" : C.text }}>{item.text}</Text>
            <Text style={{ fontSize: 10, color: item.sender === "me" ? "#ffffffaa" : C.textLight, marginTop: 3, alignSelf: "flex-end" }}>{item.time}</Text>
          </View>
        )} />
      <View style={styles.inputRow}>
        <TextInput style={styles.chatInput} value={input} onChangeText={setInput} placeholder="Type a message..." />
        <TouchableOpacity style={styles.sendBtn} onPress={send}><Ionicons name="send" size={18} color="#fff" /></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ═══════════════════════════════════════════════════════════════
//  AI CHATBOT
// ═══════════════════════════════════════════════════════════════
function AIChatbotScreen() {
  const nav = useNavigation();
  const [msgs, setMsgs] = useState([{ id: 1, text: "Hello! I am CXbot. How can I help with your MOU or partnerships?", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const flatRef = useRef(null);
  const respond = (text) => {
    if (!text.trim()) return;
    setMsgs(p => [...p, { id: Date.now(), text, sender: "user" }]);
    setInput(""); setTyping(true);
    setTimeout(() => {
      const t = text.toLowerCase();
      const reply =
        t.includes("mou") ? "Manage all MOUs in the MOU section. You can respond, propose changes, or confirm meetings." :
        t.includes("meeting") ? "Check the Meeting tab in any MOU for scheduling options." :
        t.includes("internship") ? "Post internships from the Internships section." :
        t.includes("profile") ? "Update your company profile from the drawer menu." :
        "I can help with MOUs, internships, projects, and more. What do you need?";
      setMsgs(p => [...p, { id: Date.now() + 1, text: reply, sender: "bot" }]);
      setTyping(false);
    }, 1800);
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="CXbot AI" back />
      <FlatList ref={flatRef} data={msgs} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatRef.current?.scrollToEnd()}
        ListFooterComponent={typing ? <Text style={{ color: C.textLight, marginLeft: 12, marginTop: 4, fontSize: 12 }}>CXbot is typing...</Text> : null}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === "user" ? styles.bubbleMe : { ...styles.bubbleThem, backgroundColor: "#E0F7F7" }]}>
            {item.sender === "bot" && <View style={styles.botIcon}><Ionicons name="sparkles" size={12} color="#fff" /></View>}
            <Text style={{ color: item.sender === "user" ? "#fff" : C.text }}>{item.text}</Text>
          </View>
        )} />
      <View style={styles.inputRow}>
        <TextInput style={styles.chatInput} value={input} onChangeText={setInput} placeholder="Ask CXbot anything..." />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: C.teal }]} onPress={() => respond(input)}>
          <Ionicons name="arrow-up" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ═══════════════════════════════════════════════════════════════
//  DRAWER
// ═══════════════════════════════════════════════════════════════
function CustomDrawer(props) {
  const { user } = useUser();
  const nav = useNavigation();
  const initials = (n) => n?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "CX";

  const drawerItems = [
    { screen: "Dashboard",       icon: "grid-outline",           label: "Dashboard" },
    { screen: "MoUs",            icon: "document-text-outline",  label: "MOU Management" },
    { screen: "InternshipsMain", icon: "briefcase-outline",      label: "Internships" },
    { screen: "ManageProjects",  icon: "flask-outline",          label: "Projects" },
    { screen: "MessagesMain",    icon: "chatbubbles-outline",    label: "Messages" },
    { screen: "AIChatbot",       icon: "sparkles-outline",       label: "CXbot AI" },
    { screen: "Profile",         icon: "person-circle-outline",  label: "My Profile" },
  ];

  const current = props.state?.routes[props.state?.index]?.name;

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      <View style={styles.drawerTop}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={styles.drawerLogoBox}>
              <Text style={styles.drawerLogoTxt}>CX</Text>
            </View>
            <Text style={styles.drawerBrandTxt}>Colla<Text style={{ color: C.goldLight }}>X</Text>ion</Text>
          </View>
          <TouchableOpacity onPress={() => nav.closeDrawer()} style={styles.drawerClose}>
            <Ionicons name="close" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.drawerProfileRow} onPress={() => { nav.navigate("Profile"); nav.closeDrawer(); }}>
          <View style={styles.drawerAvatar}>
            {user?.logo
              ? <Image source={{ uri: user.logo }} style={styles.drawerAvatarImg} />
              : <Text style={styles.drawerAvatarTxt}>{initials(user?.name || "CX")}</Text>}
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.drawerUserName} numberOfLines={1}>{user?.name || "Partner"}</Text>
            <Text style={styles.drawerUserSub}>{user?.industry || "Industry Partner"}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 12, paddingTop: 16 }}>
          {drawerItems.map((item, i) => {
            const active = current === item.screen;
            return (
              <TouchableOpacity key={i} style={[styles.drawerItem, active && styles.drawerItemActive]}
                onPress={() => { nav.navigate(item.screen); nav.closeDrawer(); }}>
                <View style={[styles.drawerItemIcon, { backgroundColor: active ? C.navy + "15" : "transparent" }]}>
                  <Ionicons name={item.icon} size={20} color={active ? C.navy : C.textMid} />
                </View>
                <Text style={[styles.drawerItemTxt, active && { color: C.navy, fontWeight: "700" }]}>{item.label}</Text>
                {active && <View style={styles.drawerActiveDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.drawerFooter}>
          <Text style={styles.drawerFooterTxt}>CollaXion v2.0</Text>
          <Text style={styles.drawerFooterSub}>Industry Partner Portal</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SMALL REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════
const FieldInput = ({ label, value, onChange, placeholder, multiline, editable = true, kbType }) => (
  <View style={{ marginBottom: 12 }}>
    {label && <Text style={styles.fieldLbl}>{label}</Text>}
    <TextInput
      style={[styles.fieldInput, multiline && { height: 90, textAlignVertical: "top" }, !editable && { backgroundColor: "#F3F4F6", color: C.textLight }]}
      value={value} onChangeText={onChange} placeholder={placeholder}
      placeholderTextColor={C.textLight} multiline={multiline} editable={editable}
      keyboardType={kbType || "default"} autoCapitalize="none" />
  </View>
);

const InfoCard = ({ icon, title, children }) => (
  <View style={styles.infoCardWrap}>
    <View style={styles.infoCardHead}>
      <Ionicons name={icon} size={16} color={C.teal} />
      <Text style={styles.infoCardTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const Row = ({ label, val }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoRowLbl}>{label}</Text>
    <Text style={styles.infoRowVal}>{val || "—"}</Text>
  </View>
);

// ═══════════════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════════════
const Drawer = createDrawerNavigator();
const Stack  = createNativeStackNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false, drawerStyle: { width: width * 0.80 } }}>
      <Drawer.Screen name="Dashboard"        component={DashboardScreen} />
      <Drawer.Screen name="MoUs"             component={MoUScreen} />
      <Drawer.Screen name="InternshipsMain"  component={InternshipsMainScreen} />
      <Drawer.Screen name="ManageProjects"   component={ManageProjectsScreen} />
      <Drawer.Screen name="MessagesMain"     component={MessagesScreen} />
      <Drawer.Screen name="AIChatbot"        component={AIChatbotScreen} />
      <Drawer.Screen name="Profile"          component={ProfileScreen} />
      {/* Hidden screens */}
      <Drawer.Screen name="CreateMoU"           component={CreateMoUScreen}          options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="PostNewInternship"   component={PostNewInternshipScreen}  options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="PostNewProject"      component={PostNewProjectScreen}     options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="ChatScreen"          component={ChatScreen}               options={{ drawerItemStyle: { display: "none" } }} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
          <Stack.Screen name="MouDetail"  component={MouDetailScreen} />
        </Stack.Navigator>
      </ToastProvider>
    </UserProvider>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.bg },

  toast: { position: "absolute", top: Platform.OS === "ios" ? 56 : 40, left: 12, right: 12,
    flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 16, borderWidth: 1, elevation: 12, zIndex: 9999 },
  toastTxt: { fontSize: 13, fontWeight: "700", flex: 1 },

  hdr: { backgroundColor: C.white, paddingTop: Platform.OS === "ios" ? 52 : 42, paddingBottom: 14,
    paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    elevation: 2, borderBottomWidth: 1, borderColor: C.border },
  hdrTitle: { flex: 1, fontSize: 17, fontWeight: "700", color: C.navy, marginHorizontal: 12 },
  hdrBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  hdrAction: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.teal,
    justifyContent: "center", alignItems: "center" },

  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeTxt: { fontSize: 10, fontWeight: "700" },

  dashBanner: { backgroundColor: C.navy, paddingTop: Platform.OS === "ios" ? 56 : 46, paddingBottom: 24, paddingHorizontal: 20 },
  dashBannerContent: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  dashMenuBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  dashGreet: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: "500" },
  dashName:  { fontSize: 18, fontWeight: "800", color: C.white },
  dashAvatar:{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.teal,
    justifyContent: "center", alignItems: "center", overflow: "hidden",
    borderWidth: 2, borderColor: C.goldLight, position: "relative" },
  dashAvatarImg: { width: 44, height: 44, borderRadius: 22 },
  dashAvatarTxt: { fontSize: 15, fontWeight: "900", color: "#fff" },
  dashAvatarDot: { position: "absolute", bottom: 1, right: 1, width: 10, height: 10,
    borderRadius: 5, backgroundColor: C.success, borderWidth: 1.5, borderColor: C.navy },

  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statPill: { flex: 1, alignItems: "center", paddingVertical: 12,
    borderRadius: 14, backgroundColor: "rgba(255,255,255,0.08)", marginHorizontal: 3 },
  statN:   { fontSize: 22, fontWeight: "900", color: C.white },
  statLbl: { fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 2, fontWeight: "600" },

  alertBanner: { marginHorizontal: 16, marginTop: 16, flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFF8E6", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#F0C96A44", gap: 8 },
  alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.gold },
  alertTxt: { flex: 1, fontSize: 13, color: "#92400E", fontWeight: "600" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: C.navy },
  seeAll: { fontSize: 13, color: C.teal, fontWeight: "700" },

  actionsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 8, marginBottom: 8 },
  actionTile:  { width: (width - 56) / 3, backgroundColor: C.white, borderRadius: 16,
    padding: 14, alignItems: "center", elevation: 2 },
  actionTileIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  actionTileLbl:  { fontSize: 11, fontWeight: "700", color: C.text, textAlign: "center" },

  recentMouCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: C.white, borderRadius: 14,
    padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", elevation: 1 },
  recentMouLeft: { flex: 1, marginRight: 10 },
  recentMouTitle: { fontSize: 14, fontWeight: "700", color: C.navy },
  recentMouSub:   { fontSize: 12, color: C.textMid, marginTop: 2 },
  recentMouDate:  { fontSize: 11, color: C.textLight, marginTop: 3 },

  companyCard: { margin: 16, backgroundColor: C.white, borderRadius: 16, padding: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", elevation: 2 },
  companyCardLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
  companyLogoBox: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.bg,
    justifyContent: "center", alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: C.border },
  companyLogoImg: { width: 52, height: 52, borderRadius: 14 },
  companyLogoTxt: { fontSize: 18, fontWeight: "900", color: C.navy },
  companyCardName: { fontSize: 14, fontWeight: "800", color: C.navy },
  companyCardSub:  { fontSize: 12, color: C.textMid, marginTop: 2 },
  companyCardAddr: { fontSize: 11, color: C.textLight, marginTop: 2 },
  editProfileBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#E0F7F7",
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  editProfileTxt: { fontSize: 12, color: C.teal, fontWeight: "700" },

  profBanner: { backgroundColor: C.navy, paddingTop: Platform.OS === "ios" ? 52 : 42, paddingBottom: 28,
    alignItems: "center", gap: 8 },
  profAvatarWrap: { position: "relative", marginBottom: 4 },
  profAvatarImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: C.gold },
  profAvatarTxt: { fontSize: 32, fontWeight: "900", color: "#fff", width: 96, height: 96,
    borderRadius: 48, backgroundColor: C.teal, textAlign: "center", lineHeight: 96,
    borderWidth: 3, borderColor: C.gold },
  profCamBtn: { position: "absolute", bottom: 2, right: 2, width: 30, height: 30, borderRadius: 15,
    backgroundColor: C.gold, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: C.navy },
  profName: { fontSize: 20, fontWeight: "800", color: "#fff" },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(13,115,119,0.3)",
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  verifiedTxt: { fontSize: 12, color: C.tealLight, fontWeight: "600" },
  profForm: { padding: 20 },
  profSection: { fontSize: 14, fontWeight: "800", color: C.navy, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 },
  fieldWrap:  { marginBottom: 14 },
  fieldLbl:   { fontSize: 12, fontWeight: "700", color: C.navy, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  fieldInput: { backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
    padding: 13, fontSize: 14, color: C.text, marginTop: 4 },
  saveBtn:    { backgroundColor: C.navy, padding: 16, borderRadius: 14, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  saveBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },

  filterRow:  { flexDirection: "row", backgroundColor: C.white, paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderColor: C.border, gap: 8 },
  filterTab:  { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.bg },
  filterTabActive: { backgroundColor: C.navy },
  filterTabTxt:    { fontSize: 12, fontWeight: "600", color: C.textLight },
  filterTabTxtActive: { color: "#fff" },

  mouListCard: { backgroundColor: C.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
  mouListCardUrgent: { borderLeftWidth: 4, borderLeftColor: C.gold },
  urgentBanner: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#FFF8E6",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginBottom: 10 },
  urgentTxt: { fontSize: 11, color: "#92400E", fontWeight: "700" },
  mouListHead: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  mouListTitle: { fontSize: 15, fontWeight: "700", color: C.navy },
  mouListSub: { fontSize: 12, color: C.textMid, marginTop: 3 },
  mouListFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  mouListDate: { fontSize: 12, color: C.textLight },
  mtgConfirmedChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#dcfce7",
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  mtgConfirmedTxt: { fontSize: 11, color: "#16a34a", fontWeight: "600" },

  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: C.textLight, marginTop: 14 },
  emptySub:   { fontSize: 13, color: C.textLight, marginTop: 6 },

  stepRow: { flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 16, paddingHorizontal: 24, backgroundColor: C.white, borderBottomWidth: 1, borderColor: C.border },
  stepItem: { flexDirection: "row", alignItems: "center" },
  stepDot:  { width: 28, height: 28, borderRadius: 14, backgroundColor: C.bg, borderWidth: 2, borderColor: C.border,
    justifyContent: "center", alignItems: "center" },
  stepDotActive: { backgroundColor: C.teal, borderColor: C.teal },
  stepNum: { fontSize: 12, fontWeight: "700", color: C.textLight },
  stepLbl: { fontSize: 10, color: C.textLight, fontWeight: "600", marginLeft: 6, marginRight: 8 },
  stepLine: { width: 24, height: 2, backgroundColor: C.border, marginHorizontal: 4 },
  stepLineActive: { backgroundColor: C.teal },
  stepHeading: { fontSize: 17, fontWeight: "800", color: C.navy, marginBottom: 20 },
  createForm: { padding: 20, paddingBottom: 60 },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 16 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
    borderColor: C.border, backgroundColor: C.white },
  typeChipActive: { backgroundColor: C.teal, borderColor: C.teal },
  typeChipTxt: { fontSize: 12, color: C.textMid, fontWeight: "600" },
  typeChipTxtActive: { color: "#fff" },
  objNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.navy,
    justifyContent: "center", alignItems: "center", flexShrink: 0 },
  objNumTxt: { fontSize: 11, fontWeight: "900", color: "#fff" },
  addRowBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, marginTop: 4 },
  addRowTxt: { fontSize: 13, color: C.teal, fontWeight: "700" },
  reviewCard: { backgroundColor: "#F0FAFA", borderRadius: 14, padding: 16, marginTop: 20, borderWidth: 1, borderColor: C.teal + "33" },
  reviewTitle: { fontSize: 14, fontWeight: "800", color: C.teal, marginBottom: 12 },
  reviewRow:   { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8,
    borderBottomWidth: 1, borderColor: C.border },
  reviewLbl:   { fontSize: 13, color: C.textMid, fontWeight: "600" },
  reviewVal:   { fontSize: 13, color: C.navy, fontWeight: "700", maxWidth: "55%", textAlign: "right" },
  stepBtns: { flexDirection: "row", gap: 12, marginTop: 32 },
  backStepBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1.5, borderColor: C.teal },
  backStepTxt: { fontSize: 14, color: C.teal, fontWeight: "700" },
  nextStepBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: C.navy, padding: 14, borderRadius: 14 },
  nextStepTxt: { fontSize: 14, color: "#fff", fontWeight: "700" },

  statusStrip: { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.white,
    borderBottomWidth: 1, borderColor: C.border, gap: 10 },
  respBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.teal,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  respBtnTxt: { fontSize: 12, color: "#fff", fontWeight: "700" },
  tabBar:  { flexDirection: "row", backgroundColor: C.white, borderBottomWidth: 1, borderColor: C.border },
  tabItem: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 5, paddingVertical: 13 },
  tabItemActive: { borderBottomWidth: 2.5, borderBottomColor: C.teal },
  tabTxt:  { fontSize: 12, color: C.textLight, fontWeight: "600" },
  tabTxtActive: { color: C.teal, fontWeight: "700" },

  infoCardWrap: { backgroundColor: C.white, borderRadius: 14, padding: 16, marginBottom: 12, elevation: 1 },
  infoCardHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 10,
    borderBottomWidth: 1, borderColor: C.border },
  infoCardTitle: { fontSize: 14, fontWeight: "800", color: C.navy },
  infoRow:   { flexDirection: "row", justifyContent: "space-between", paddingVertical: 7 },
  infoRowLbl:{ fontSize: 12, color: C.textLight, fontWeight: "600" },
  infoRowVal:{ fontSize: 13, color: C.navy, fontWeight: "700", maxWidth: "58%", textAlign: "right" },
  infoText:  { fontSize: 13, color: C.text, lineHeight: 20 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  bullet:    { width: 6, height: 6, borderRadius: 3, backgroundColor: C.teal, marginTop: 6, flexShrink: 0 },
  bulletTxt: { fontSize: 13, color: C.text, flex: 1, lineHeight: 20 },

  changeRow:    { backgroundColor: "#F5F3FF", borderRadius: 10, padding: 12, marginBottom: 8 },
  changeLbl:    { fontSize: 12, fontWeight: "800", color: C.purple },
  changeVals:   { fontSize: 13, marginTop: 4 },
  changeReason: { fontSize: 11, color: C.textLight, marginTop: 4 },

  stampRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  stampDot: { width: 10, height: 10, borderRadius: 5 },
  stampLbl: { fontSize: 13, fontWeight: "700", color: C.text },
  stampDate:{ fontSize: 11, color: C.textLight, marginTop: 2 },

  confirmedCard: { backgroundColor: "#F0FDF4", borderWidth: 1.5, borderColor: "#86EFAC", borderRadius: 16, padding: 18, marginBottom: 14 },
  confirmedIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#16A34A", justifyContent: "center", alignItems: "center" },
  confirmedTitle: { fontSize: 16, fontWeight: "800", color: "#166534" },
  confirmedSince: { fontSize: 11, color: "#6B7280", marginTop: 12 },
  dtCell: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#BBF7D0" },
  dtLabel:{ fontSize: 9, color: "#6B7280", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
  dtVal:  { fontSize: 14, fontWeight: "800", color: "#15803D" },
  mtgMeta:{ fontSize: 12, color: C.textMid, marginTop: 8 },

  pendingCard:  { backgroundColor: "#FFFBEB", borderWidth: 1.5, borderColor: "#FDE68A", borderRadius: 16, padding: 16, marginBottom: 14 },
  pendingTitle: { fontSize: 14, fontWeight: "700", color: "#92400E", marginBottom: 6 },
  pendingSub:   { fontSize: 12, color: "#A16207", marginBottom: 10 },

  infoNote: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#EFF6FF",
    padding: 12, borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: "#BFDBFE" },
  infoNoteTxt: { fontSize: 12, color: "#0284C7", flex: 1, fontWeight: "500" },

  slotCard: { backgroundColor: C.white, borderRadius: 14, padding: 14, marginBottom: 10,
    flexDirection: "row", alignItems: "center", gap: 12, elevation: 1, borderWidth: 1, borderColor: "#BFDBFE" },
  slotDate: { fontSize: 14, fontWeight: "700", color: C.navy },
  slotNote: { fontSize: 12, color: C.textMid, marginTop: 3 },
  selectBtn:{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#16A34A",
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  selectTxt:{ fontSize: 12, color: "#fff", fontWeight: "700" },
  outlineBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1.5, borderColor: C.teal,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, marginTop: 12, alignSelf: "flex-start" },
  outlineTxt: { fontSize: 12, color: C.teal, fontWeight: "700" },

  actSection: { fontSize: 14, fontWeight: "800", color: C.navy, marginBottom: 14 },
  tlRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  tlDot: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  tlLine:{ display: "none" },
  tlLbl: { fontSize: 13, fontWeight: "600" },
  tlDate:{ fontSize: 11, color: C.textLight, marginTop: 2 },
  logCard:{ borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1 },

  overlay:    { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet:      { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: "92%", paddingBottom: Platform.OS === "ios" ? 34 : 16 },
  sheetHandle:{ width: 36, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: "center", marginTop: 10 },
  sheetHead:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 20, borderBottomWidth: 1, borderColor: C.border },
  sheetTitle: { fontSize: 16, fontWeight: "800", color: C.navy, flex: 1 },
  sheetFoot:  { flexDirection: "row", gap: 12, padding: 16, borderTopWidth: 1, borderColor: C.border },

  respTypeBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.white, minWidth: "42%" },
  respTypeTxt: { fontSize: 12, fontWeight: "700", color: C.textLight },
  changeBlock: { backgroundColor: "#F5F3FF", borderRadius: 12, padding: 12, marginBottom: 10 },

  optRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#F0F9FF", borderRadius: 10, padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: "#BAE6FD" },
  optTxt: { fontSize: 13, color: "#0284C7", fontWeight: "600" },

  listCard:    { backgroundColor: C.white, borderRadius: 14, padding: 16, marginBottom: 10, elevation: 1 },
  listCardTitle:{ fontSize: 15, fontWeight: "700", color: C.navy },
  listCardSub:  { fontSize: 12, color: C.textMid, marginTop: 4 },
  listCardMeta: { fontSize: 12, color: C.textLight },
  createBtn:   { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: C.navy, padding: 14, borderRadius: 14, marginBottom: 16 },
  createBtnTxt:{ color: "#fff", fontSize: 15, fontWeight: "700" },
  formPad:     { padding: 20, paddingBottom: 60 },

  chatItem: { flexDirection: "row", backgroundColor: C.white, borderRadius: 14, marginBottom: 10, padding: 14, gap: 12, elevation: 1 },
  chatAvatar:{ width: 48, height: 48, borderRadius: 24 },
  chatName: { fontSize: 14, fontWeight: "700", color: C.navy },
  chatTime: { fontSize: 11, color: C.textLight },
  chatSub:  { fontSize: 11, color: C.teal, fontWeight: "600", marginBottom: 3 },
  chatMsg:  { fontSize: 13, color: C.textLight, flex: 1 },
  unreadDot:{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.navy, justifyContent: "center", alignItems: "center" },
  unreadNum:{ fontSize: 10, color: "#fff", fontWeight: "700" },
  chatHdr:  { flexDirection: "row", alignItems: "center", gap: 12, padding: 16,
    paddingTop: Platform.OS === "ios" ? 52 : 42, backgroundColor: C.white, elevation: 2, borderBottomWidth: 1, borderColor: C.border },
  chatHdrAvt: { width: 38, height: 38, borderRadius: 19 },
  chatHdrName:{ fontSize: 15, fontWeight: "700", color: C.navy },
  bubble:   { padding: 12, borderRadius: 18, maxWidth: "80%", marginBottom: 10 },
  bubbleMe: { alignSelf: "flex-end", backgroundColor: C.navy, borderBottomRightRadius: 4 },
  bubbleThem:{ alignSelf: "flex-start", backgroundColor: "#E5E7EB", borderBottomLeftRadius: 4 },
  botIcon:  { width: 22, height: 22, borderRadius: 11, backgroundColor: C.teal,
    justifyContent: "center", alignItems: "center", marginBottom: 6 },
  inputRow: { flexDirection: "row", padding: 12, backgroundColor: C.white,
    borderTopWidth: 1, borderColor: C.border, alignItems: "center", gap: 10 },
  chatInput:{ flex: 1, backgroundColor: C.bg, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
  sendBtn:  { width: 44, height: 44, borderRadius: 22, backgroundColor: C.navy, justifyContent: "center", alignItems: "center" },

  drawerTop: { backgroundColor: C.navy, paddingTop: Platform.OS === "ios" ? 58 : 46,
    paddingHorizontal: 20, paddingBottom: 24 },
  drawerLogoBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.teal,
    justifyContent: "center", alignItems: "center" },
  drawerLogoTxt: { fontSize: 13, fontWeight: "900", color: "#fff" },
  drawerBrandTxt:{ fontSize: 18, fontWeight: "800", color: "#fff" },
  drawerClose: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center", alignItems: "center" },
  drawerProfileRow: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16, padding: 12 },
  drawerAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.teal,
    justifyContent: "center", alignItems: "center", overflow: "hidden",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.25)" },
  drawerAvatarImg: { width: 52, height: 52, borderRadius: 26 },
  drawerAvatarTxt: { fontSize: 18, fontWeight: "900", color: "#fff" },
  drawerUserName:  { fontSize: 15, fontWeight: "800", color: "#fff" },
  drawerUserSub:   { fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 },
  drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10,
    borderRadius: 14, marginBottom: 4, gap: 12 },
  drawerItemActive: { backgroundColor: C.navy + "0D" },
  drawerItemIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  drawerItemTxt:  { flex: 1, fontSize: 14, fontWeight: "600", color: C.textMid },
  drawerActiveDot:{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.teal },
  drawerFooter:   { padding: 20, paddingTop: 10, borderTopWidth: 1, borderColor: C.border, margin: 12, marginTop: 20, borderRadius: 12 },
  drawerFooterTxt:{ fontSize: 12, fontWeight: "700", color: C.textMid },
  drawerFooterSub:{ fontSize: 11, color: C.textLight, marginTop: 2 },
});