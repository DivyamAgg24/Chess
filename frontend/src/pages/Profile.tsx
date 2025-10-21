import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Crown, Trophy, Target, Calendar, Mail, User, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Chess Master",
        email: "chessmaster@example.com",
        username: "ChessMaster2024",
        bio: "Passionate chess player with 10 years of experience. Love tactical puzzles and endgame studies.",
        rating: 1850,
        gamesPlayed: 432,
        winRate: 64,
        joinDate: "January 2024"
    });

    const stats = [
        { icon: Trophy, label: "Rating", value: profile.rating, color: "text-primary" },
        { icon: Target, label: "Games Played", value: profile.gamesPlayed, color: "text-primary" },
        { icon: Crown, label: "Win Rate", value: `${profile.winRate}%`, color: "text-primary" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
                        <Button variant="outline" onClick={() => navigate("/")}>
                            Back to Home
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Profile Header Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                <div className="h-32 w-32">
                                    <img src="/user-image.007dad08.svg" alt={profile.name} />
                                    <div className="bg-primary text-primary-foreground text-3xl">
                                        {profile.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left space-y-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-foreground">{profile.name}</h2>
                                        <p className="text-muted-foreground">@{profile.username}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                        {stats.map((stat, index) => (
                                            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                                    <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    variant={isEditing ? "secondary" : "default"}
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="gap-2"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs Section */}
                    <div className="w-full">
                        <div className="grid w-full grid-cols-3">
                            <div >About</div>
                            <div >Statistics</div>
                            <div >Achievements</div>
                        </div>

                        <div  className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Your account details and bio</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Full Name
                                        </label>
                                        <input
                                            id="name"
                                            value={profile.name}
                                            disabled={!isEditing}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={profile.email}
                                            disabled={!isEditing}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="username">Username</label>
                                        <input
                                            id="username"
                                            value={profile.username}
                                            disabled={!isEditing}
                                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="bio">Bio</label>
                                        <textarea
                                            id="bio"
                                            value={profile.bio}
                                            disabled={!isEditing}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            rows={4}
                                        />
                                    </div>

                                    {isEditing && (
                                        <Button className="w-full">Save Changes</Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div  className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Game Statistics</CardTitle>
                                    <CardDescription>Your performance overview</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground">Total Games</span>
                                                <span className="text-2xl font-bold text-foreground">{profile.gamesPlayed}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground">Wins</span>
                                                <span className="text-2xl font-bold text-foreground">277</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground">Draws</span>
                                                <span className="text-2xl font-bold text-foreground">64</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground">Losses</span>
                                                <span className="text-2xl font-bold text-foreground">91</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground">Win Rate</span>
                                                <span className="text-2xl font-bold text-primary">{profile.winRate}%</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Member Since
                                                </span>
                                                <span className="text-lg font-semibold text-foreground">{profile.joinDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div  className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Achievements & Milestones</CardTitle>
                                    <CardDescription>Your chess journey highlights</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { title: "First Victory", desc: "Won your first game", icon: Trophy },
                                            { title: "Century Club", desc: "Played 100+ games", icon: Target },
                                            { title: "Rising Star", desc: "Reached 1800 rating", icon: Crown },
                                            { title: "Puzzle Master", desc: "Solved 500 puzzles", icon: Target },
                                        ].map((achievement, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <achievement.icon className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
