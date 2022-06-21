import apiGetter from '../features/apicalls/apiGetter';
import UserInterface from '../interfaces/UserInterface';

type Props = {
  achievement: any;
};

function AchievementMiniature({ achievement }: Props) {
  console.log(achievement.achievementLogo);
  return (
    <div className="miniAchievement">
      <img className="profilepic" src={achievement.achievementLogo} alt="" />
      {achievement.achievementName}
    </div>
  );
}

export default AchievementMiniature;
