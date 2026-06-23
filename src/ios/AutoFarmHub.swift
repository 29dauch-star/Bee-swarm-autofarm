// AutoFarmHub.swift
// Bee Swarm Auto Farmer - iOS Hub Interface for Delta

import SwiftUI
import Combine

struct AutoFarmHub: View {
    @StateObject private var viewModel = HubViewModel()
    @State private var showSettings = false
    @State private var deltaStatus = "Disconnected"
    @State private var selectedFarmingMode = "smart"
    
    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.1, green: 0.1, blue: 0.15),
                    Color(red: 0.15, green: 0.15, blue: 0.2)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 20) {
                // Header with settings
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("🐝 Auto Farmer Hub")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        Text("Bee Swarm Simulator")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    
                    Spacer()
                    
                    VStack(spacing: 4) {
                        Circle()
                            .fill(viewModel.isRunning ? Color.green : Color.red)
                            .frame(width: 8, height: 8)
                        Text(viewModel.isRunning ? "ACTIVE" : "IDLE")
                            .font(.caption2)
                            .foregroundColor(.gray)
                    }
                }
                .padding()
                .background(Color.black.opacity(0.4))
                .cornerRadius(12)
                
                // Main activation button with bee icon
                VStack(spacing: 15) {
                    ZStack {
                        Circle()
                            .fill(
                                viewModel.isRunning
                                    ? LinearGradient(
                                        gradient: Gradient(colors: [Color(red: 1, green: 0.8, blue: 0), Color(red: 1, green: 0.6, blue: 0)]),
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                    : LinearGradient(
                                        gradient: Gradient(colors: [Color.gray, Color(red: 0.5, green: 0.5, blue: 0.5)]),
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                            )
                            .frame(width: 140, height: 140)
                            .shadow(color: viewModel.isRunning ? Color.yellow.opacity(0.5) : Color.black.opacity(0.3), radius: 15)
                        
                        VStack(spacing: 10) {
                            Text("🐝")
                                .font(.system(size: 70))
                            Text(viewModel.isRunning ? "FARMING" : "TAP TO START")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                        }
                    }
                    .onTapGesture {
                        withAnimation(.spring()) {
                            viewModel.toggleFarming()
                        }
                    }
                    
                    Text(viewModel.statusMessage)
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                .frame(maxWidth: .infinity)
                .padding(20)
                .background(Color.black.opacity(0.3))
                .cornerRadius(16)
                
                // Farming Mode Selector
                VStack(spacing: 10) {
                    Text("FARMING MODE")
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundColor(.gray)
                    
                    Picker("Mode", selection: $selectedFarmingMode) {
                        Text("🎯 Smart").tag("smart")
                        Text("⚡ Aggressive").tag("aggressive")
                        Text("⚖️ Balanced").tag("balanced")
                        Text("😴 Sleep").tag("sleep")
                    }
                    .pickerStyle(.segmented)
                    .onChange(of: selectedFarmingMode) { mode in
                        viewModel.updateMode(mode)
                    }
                }
                .padding()
                .background(Color.black.opacity(0.3))
                .cornerRadius(12)
                
                // Stats Display
                ScrollView {
                    VStack(spacing: 10) {
                        StatCard(icon: "🍯", label: "Honey", value: viewModel.honey)
                        StatCard(icon: "⭐", label: "XP", value: viewModel.xp)
                        StatCard(icon: "🌼", label: "Nectar", value: viewModel.nectar)
                        StatCard(icon: "💛", label: "Pollen", value: viewModel.pollen)
                        StatCard(icon: "⏱️", label: "Time", value: viewModel.timeSpent)
                    }
                }
                
                // Sleep Mode Toggle
                HStack {
                    Label("Sleep Mode", systemImage: "moon.zzz.fill")
                        .foregroundColor(.white)
                    Spacer()
                    Toggle("", isOn: $viewModel.sleepModeEnabled)
                        .onChange(of: viewModel.sleepModeEnabled) { enabled in
                            viewModel.toggleSleepMode(enabled)
                        }
                }
                .padding()
                .background(Color.black.opacity(0.3))
                .cornerRadius(12)
                
                // Delta Connection Status
                HStack {
                    Circle()
                        .fill(viewModel.deltaConnected ? Color.green : Color.orange)
                        .frame(width: 8, height: 8)
                    
                    Text(viewModel.deltaConnected ? "Delta Connected" : "Delta Connecting...")
                        .font(.caption)
                        .foregroundColor(.white)
                    
                    Spacer()
                    
                    if !viewModel.deltaConnected {
                        ProgressView()
                            .scaleEffect(0.8)
                    }
                }
                .padding()
                .background(Color.black.opacity(0.3))
                .cornerRadius(12)
                
                Spacer()
                
                // Bottom action buttons
                HStack(spacing: 12) {
                    Button(action: { showSettings = true }) {
                        Label("Settings", systemImage: "gear")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue.opacity(0.3))
                            .cornerRadius(8)
                            .foregroundColor(.white)
                    }
                    
                    Button(action: { viewModel.openGitHub() }) {
                        Label("GitHub", systemImage: "link")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.purple.opacity(0.3))
                            .cornerRadius(8)
                            .foregroundColor(.white)
                    }
                }
            }
            .padding(16)
        }
        .sheet(isPresented: $showSettings) {
            SettingsView(viewModel: viewModel)
        }
        .onAppear {
            viewModel.connectToDelta()
        }
    }
}

struct StatCard: View {
    let icon: String
    let label: String
    let value: Int
    
    var body: some View {
        HStack {
            Text(icon)
                .font(.title3)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(.caption)
                    .foregroundColor(.gray)
                Text("\(value.formatted(.number))")
                    .font(.headline)
                    .foregroundColor(.white)
            }
            
            Spacer()
        }
        .padding()
        .background(Color.black.opacity(0.4))
        .cornerRadius(10)
    }
}

struct SettingsView: View {
    @ObservedObject var viewModel: HubViewModel
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Farming Settings")) {
                    Toggle("AI Enabled", isOn: .constant(true))
                    Toggle("Auto Upgrade", isOn: .constant(true))
                    Stepper("Field Delay: 500ms", value: .constant(500), in: 100...2000, step: 100)
                }
                
                Section(header: Text("Resource Priority")) {
                    Toggle("🍯 Honey", isOn: .constant(true))
                    Toggle("⭐ XP", isOn: .constant(true))
                    Toggle("🌼 Nectar", isOn: .constant(true))
                    Toggle("💛 Pollen", isOn: .constant(true))
                }
                
                Section(header: Text("Performance")) {
                    Toggle("Battery Optimization", isOn: .constant(true))
                    Toggle("Network Optimization", isOn: .constant(true))
                }
                
                Section {
                    Button(action: { viewModel.resetStats() }) {
                        Text("Reset Statistics")
                            .foregroundColor(.red)
                    }
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}

class HubViewModel: ObservableObject {
    @Published var isRunning = false
    @Published var statusMessage = "Tap bee to start farming"
    @Published var honey = 0
    @Published var xp = 0
    @Published var nectar = 0
    @Published var pollen = 0
    @Published var timeSpent = 0
    @Published var sleepModeEnabled = true
    @Published var deltaConnected = false
    
    func toggleFarming() {
        isRunning.toggle()
        statusMessage = isRunning ? "🌾 Farming in progress..." : "✋ Farming paused"
    }
    
    func updateMode(_ mode: String) {
        statusMessage = "Mode changed to \(mode)"
    }
    
    func toggleSleepMode(_ enabled: Bool) {
        sleepModeEnabled = enabled
        statusMessage = enabled ? "😴 Sleep mode ON" : "👁️ Sleep mode OFF"
    }
    
    func connectToDelta() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.deltaConnected = true
        }
    }
    
    func resetStats() {
        honey = 0
        xp = 0
        nectar = 0
        pollen = 0
        timeSpent = 0
        statusMessage = "📊 Statistics reset"
    }
    
    func openGitHub() {
        if let url = URL(string: "https://github.com/29dauch-star/bee-swarm-autofarm") {
            UIApplication.shared.open(url)
        }
    }
}