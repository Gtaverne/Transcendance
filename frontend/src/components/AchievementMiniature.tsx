type Props = {
  achievement: any;
};

function AchievementMiniature({ achievement }: Props) {
  return (
    <div className="miniAchievement">
      <img
        className="profilepic"
        src={achievement.achievementLogo}
        alt=""
        title={achievement.achievementDescription}
      />
      {achievement.achievementName}
    </div>
  );
}

export default AchievementMiniature;
