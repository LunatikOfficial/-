import { DisplayValueHeader, Color, Vector3 } from 'pixel_combats/basic';
import { Game, Map, MapEditor, Players, Inventory, LeaderBoard, BuildBlocksSet, Teams, Damage, BreackGraph, Ui, Properties, GameMode, Spawns, Timers, TeamsBalancer, Build, AreaService, AreaPlayerTriggerService, AreaViewService, Chat } from 'pixel_combats/room';

const weaponcolor = new Color(0, 1, 1, 0);
const skincolor = new Color(0, 5, 0, 0);
const block = new Color(128, 128, 0, 0);
const fly = new Color(0, 0, 2, 0);
const hpcolor = new Color(9, 0, 0, 0);
const statcolor = new Color(1, 1, 1, 1);
const spawncolor = new Color(1, 1, 1, 1);
const bancolor = new Color(0, 0, 0, 0);
const micolor = new Color(0.5, 0.5, 0.5, 0);

let Inv = Inventory.GetContext(), Sp = Spawns.GetContext(), Dmg = Damage.GetContext();
let ImportantPlayersIDs = {
        Admins: ['16355958893E0F11', 'E730023519401808'],
        VIPs: {
		LVL3: ['E730023519401808'],
		LVL2: ['40265AFE3B5A0AC2'],
		LVL1: ['12EC16F532498F3F']
	},
        Bans: ['']
};

Dmg.DamageOut.Value = true;
Dmg.FriendlyFire.Value = true;
BreackGraph.OnlyPlayerBlocksDmg = true;

let Props = Properties.GetContext();
Props.Get('Time_Hours').Value = 0;
Props.Get('Time_Minutes').Value = 0;
Props.Get('Time_Seconds').Value = 0;
Props.Get('Players_Now').Value = 0;
Props.Get('Players_WereMax').Value = 0;
Props.Get('Time_FixedString').Value = '00:00:00';
let ServerTimer = Timers.GetContext().Get('Server');
ServerTimer.OnTimer.Add(function(t) {
	Props.Get('Time_Seconds').Value++;
	if (Props.Get('Time_Seconds').Value >= 60) {
		Props.Get('Time_Seconds').Value = 0;
		Props.Get('Time_Minutes').Value++;
	}
	if (Props.Get('Time_Minutes').Value >= 60) {
		Props.Get('Time_Minutes').Value = 0;
		Props.Get('Time_Hours').Value++;
	}
	Props.Get('Players_Now').Value = Players.All.length;
	if (Props.Get('Players_Now').Value > Props.Get('Players_WereMax').Value) Props.Get('Players_WereMax').Value = Props.Get('Players_Now').Value;
	Props.Get('Time_FixedString').Value = `${Props.Get('Time_Hours').Value < 10 ? '0' + Props.Get('Time_Hours').Value : Props.Get('Time_Hours').Value}:${Props.Get('Time_Minutes').Value < 10 ? '0' + Props.Get('Time_Minutes').Value : Props.Get('Time_Minutes').Value}:${Props.Get('Time_Seconds').Value < 10 ? '0' + Props.Get('Time_Seconds').Value : Props.Get('Time_Seconds').Value}`;
	Teams.Get('Admins').Properties.Get('Deaths').Value = `<b><i>Покупки от <color=red>Ruslan</a></i></b>`;
	Teams.Get('Players').Properties.Get('Deaths').Value = `Время: ${Props.Get('Time_FixedString').Value}`;
});
ServerTimer.RestartLoop(1);

Teams.Add('Players', '<b><i>Игроки</i></b>', new Color(0, 0, 0, 0));
Teams.Add('Admins', '<b><i>Админы</i></b>', new Color(0, 0, 0, 0));
let AdminsTeam = Teams.Get('Admins'), PlayersTeam = Teams.Get('Players');
PlayersTeam.Spawns.SpawnPointsGroups.Add(1);
AdminsTeam.Spawns.SpawnPointsGroups.Add(2);
PlayersTeam.Build.BlocksSet.Value = BuildBlocksSet.Blue;
AdminsTeam.Build.BlocksSet.Value = BuildBlocksSet.AllClear;

LeaderBoard.PlayerLeaderBoardValues = [
        new DisplayValueHeader('Kills', '<b><i>Киллы</i></b>', '<b><i>Киллы</i></b>'),
        new DisplayValueHeader('Deaths', '<b><i>Смерти</i></b>', '<b><i>Смерти</i></b>'),
        new DisplayValueHeader('Scores', '<b><i>Очки</i></b>', '<b><i>Очки</i></b>'),
        new DisplayValueHeader('Status', '<b><i>Статус</i></b>', '<b><i>Статус</i></b>'),
        new DisplayValueHeader('RoomID', '<b><i>Room ID</i></b>', '<b><i>Room ID</i></b>')
];
LeaderBoard.PlayersWeightGetter.Set(function(p) {
        return p.Properties.Get('Scores').Value;
});

function AdmPlayer(p) {
	p.inventory.Main.Value = true;
	p.inventory.MainInfinity.Value = true;
	p.inventory.Secondary.Value = true;
	p.inventory.SecondaryInfinity.Value = true;
	p.inventory.Melee.Value = true;
	p.inventory.Explosive.Value = true;
	p.inventory.ExplosiveInfinity.Value = true;
	p.inventory.Build.Value = true;
	p.inventory.BuildInfinity.Value = true;
	p.contextedProperties.SkinType.Value = 1;
	p.Build.Pipette.Value = true;
	p.Build.FlyEnable.Value = true;
	p.Build.BalkLenChange.Value = true;
	p.Build.BuildRangeEnable.Value = true;
	p.Build.BuildModeEnable.Value = true;
	p.Build.RemoveQuad.Value = true;
	p.Build.FillQuad.Value = true;
	p.Build.FloodFill.Value = true;
	p.Build.ChangeSpawnsEnable.Value = true;
	p.Build.LoadMapEnable.Value = true;
	p.Build.ChangeMapAuthorsEnable.Value = true;
	p.Build.GenMapEnable.Value = true;
	p.Build.ChangeCameraPointsEnable.Value = true;
	p.Build.CollapseChangeEnable.Value = true;
	p.Build.QuadChangeEnable.Value = true;
	p.Build.SetSkyEnable.Value = true;
	p.Build.BlocksSet.Value = BuildBlocksSet.AllClear;
	p.Properties.Get('Adm').Value = '+';
	p.Properties.Get('Status').Value = '<b><i>Админ</i></b>';
}
function UnAdmPlayer(p) {
	p.inventory.Main.Value = false;
	p.inventory.MainInfinity.Value = false;
	p.inventory.Secondary.Value = false;
	p.inventory.SecondaryInfinity.Value = false;
	p.inventory.Melee.Value = false;
	p.inventory.Explosive.Value = false;
	p.inventory.ExplosiveInfinity.Value = false;
	p.inventory.Build.Value = false;
	p.inventory.BuildInfinity.Value = false;
	p.contextedProperties.SkinType.Value = 0;
	p.Build.Pipette.Value = false;
	p.Build.FlyEnable.Value = false;
	p.Build.BalkLenChange.Value = false;
	p.Build.BuildRangeEnable.Value = false;
	p.Build.BuildModeEnable.Value = false;
	p.Build.RemoveQuad.Value = false;
	p.Build.FillQuad.Value = false;
	p.Build.FloodFill.Value = false;
	p.Build.ChangeSpawnsEnable.Value = false;
	p.Build.LoadMapEnable.Value = false;
	p.Build.ChangeMapAuthorsEnable.Value = false;
	p.Build.GenMapEnable.Value = false;
	p.Build.ChangeCameraPointsEnable.Value = false;
	p.Build.CollapseChangeEnable.Value = false;
	p.Build.QuadChangeEnable.Value = false;
	p.Build.SetSkyEnable.Value = false;
	p.Build.BlocksSet.Value = BuildBlocksSet.Blue;
	p.Damage.DamageIn.Value = true;
	p.Properties.Get('Adm').Value = '-';
	p.Properties.Get('Status').Value = '<b><i>Игрок</i></b>';
}

Ui.GetContext().TeamProp1.Value = { Team: "Admins", Prop: "Deaths" };
Ui.GetContext().TeamProp2.Value = { Team: "Players", Prop: "Deaths" };

Players.OnPlayerConnected.Add(function(p) {
	p.Ui.Hint.Value = 'Загрузка...';
});
Teams.OnRequestJoinTeam.Add(function(p, t) {
        p.Properties.Get('RoomID').Value = p.IdInRoom;
	p.Properties.Get('Ban').Value = '-';
	p.Properties.Get('Adm').Value = '-';
	if (Props.Get(`${p.id}_Main`).Value) p.inventory.Main.Value = true;
	if (Props.Get(`${p.id}_MainInfinity`).Value) p.inventory.MainInfinity.Value = true;
	if (Props.Get(`${p.id}_Secondary`).Value) p.inventory.Secondary.Value = true;
	if (Props.Get(`${p.id}_SecondaryInfinity`).Value) p.inventory.SecondaryInfinity.Value = true;
	if (Props.Get(`${p.id}_Melee`).Value) p.inventory.Melee.Value = true;
	if (Props.Get(`${p.id}_Explosive`).Value) p.inventory.Explosive.Value = true;
	if (Props.Get(`${p.id}_ExplosiveInfinity`).Value) p.inventory.ExplosiveInfinity.Value = true;
	if (Props.Get(`${p.id}_MaxHp`).Value) p.contextedProperties.MaxHp.Value = Props.Get(`${p.id}_MaxHp`).Value;
	if (Props.Get(`${p.id}_Scores`).Value) p.Properties.Scores.Value = Props.Get(`${p.id}_Scores`).Value;
	if (Props.Get(`${p.id}_Kills`).Value) p.Properties.Kills.Value = Props.Get(`${p.id}_Kills`).Value;
	if (Props.Get(`${p.id}_Deaths`).Value) p.Properties.Deaths.Value = Props.Get(`${p.id}_Deaths`).Value;
	if (Props.Get(`${p.id}_Fly`).Value) p.Build.FlyEnable.Value = true;
	if (Props.Get(`${p.id}_Skin`).Value) p.contextedProperties.SkinType.Value = Props.Get(`${p.id}_Skin`).Value;
	if (Props.Get(`${p.id}_Status`).Value) p.Properties.Get('Status').Value = Props.Get(`${p.id}_Status`).Value;
        function GiveAdmForPlayer(player) {
                player.inventory.Main.Value = true;
                player.inventory.MainInfinity.Value = true;
                player.inventory.Secondary.Value = true;
                player.inventory.SecondaryInfinity.Value = true;
                player.inventory.Melee.Value = true;
                player.inventory.Explosive.Value = true;
                player.inventory.ExplosiveInfinity.Value = true;
                player.inventory.Build.Value = true;
                player.inventory.BuildInfinity.Value = true;
                player.contextedProperties.SkinType.Value = 1;
                player.Build.Pipette.Value = true;
                player.Build.FlyEnable.Value = true;
                player.Build.BalkLenChange.Value = true;
                player.Build.BuildRangeEnable.Value = true;
                player.Build.BuildModeEnable.Value = true;
                player.Build.RemoveQuad.Value = true;
                player.Build.FillQuad.Value = true;
                player.Build.FloodFill.Value = true;
                player.Build.ChangeSpawnsEnable.Value = true;
                player.Build.LoadMapEnable.Value = true;
                player.Build.ChangeMapAuthorsEnable.Value = true;
                player.Build.GenMapEnable.Value = true;
                player.Build.ChangeCameraPointsEnable.Value = true;
                player.Build.CollapseChangeEnable.Value = true;
                player.Build.QuadChangeEnable.Value = true;
                player.Build.SetSkyEnable.Value = true;
                player.Build.BlocksSet.Value = BuildBlocksSet.AllClear;
                player.Damage.DamageIn.Value = false;
		player.Properties.Get('Adm').Value = '+';
        }
        if (ImportantPlayersIDs.Admins.includes(p.id)) {
                AdminsTeam.Add(p);
                GiveAdmForPlayer(p);
                if (p.id == '16355958893E0F11', 'E730023519401808') p.Properties.Get('Status').Value = '<color=yellow><b><i>Создатель</i></b></color>';
        } else {
                PlayersTeam.Add(p);
                p.Properties.Get('Status').Value = '<b><i>Игрок</i></b>';
        }
});
Teams.OnPlayerChangeTeam.Add(function(p){ 
        p.Spawns.Spawn();
        if (ImportantPlayersIDs.Bans.includes(p.id)) {
                p.spawns.enable = false;
                p.spawns.Despawn();
                p.Properties.Get('Status').Value = '<b><i>За<color=red>BAN</color>еный Игрок</i></b>';
		p.Properties.Get('Ban').Value = '+';
                p.Ui.Hint.Value = `Вы заBANены!`;
        }
        p.PopUp(`<b><i>Добро пожаловать ${p.NickName}</i></b>`);
        p.PopUp(`<b><i>Не знаете как играть? Напишите в чат "/help".</i></b>`);
        p.PopUp(`<b><i>Слушайся админа</i></b>`);
	p.PopUp(`<b><i>Режим создал <color=red>Lunatik</color>для Ruslan's</i></b> `);
});
Players.OnPlayerDisconnected.Add(function(p) {
	Props.Get(`${p.id}_Main`).Value = p.inventory.Main.Value;
	Props.Get(`${p.id}_MainInfinity`).Value = p.inventory.MainInfinity.Value;
	Props.Get(`${p.id}_Secondary`).Value = p.inventory.Secondary.Value;
	Props.Get(`${p.id}_SecondaryInfinity`).Value = p.inventory.SecondaryInfinity.Value;
	Props.Get(`${p.id}_Melee`).Value = p.inventory.Melee.Value;
	Props.Get(`${p.id}_Explosive`).Value = p.inventory.Explosive.Value;
	Props.Get(`${p.id}_ExplosiveInfinity`).Value = p.inventory.ExplosiveInfinity.Value;
	Props.Get(`${p.id}_MaxHp`).Value = p.contextedProperties.MaxHp.Value;
	Props.Get(`${p.id}_Scores`).Value = p.Properties.Scores.Value;
	Props.Get(`${p.id}_Kills`).Value = p.Properties.Kills.Value;
	Props.Get(`${p.id}_Deaths`).Value = p.Properties.Deaths.Value;
	Props.Get(`${p.id}_Fly`).Value = p.Build.FlyEnable.Value;
	Props.Get(`${p.id}_Skin`).Value = p.contextedProperties.SkinType.Value;
	Props.Get(`${p.id}_Status`).Value = p.Properties.Get('Status').Value;
});

Spawns.GetContext().OnSpawn.Add(function(p){
  p.Properties.Immortality.Value = true;
  t = p.Timers.Get('immortality').Restart(3);
});
Timers.OnPlayerTimer.Add(function(t){
  if (t.Id != 'immortality') return;
  t.Player.Properties.Immortality.Value = false;
});

Damage.OnDeath.Add(function(p) {
  if (GameMode.Parameters.GetBool('AutoSpawn')) {
    Spawns.GetContext(p).Spawn();
    ++p.Properties.Deaths.Value;
    return;
  }
  ++p.Properties.Deaths.Value;
});

Damage.OnDamage.Add(function(p, dmgd, dmg) {
        if (p.id != dmgd.id) p.Properties.Scores.Value += Math.ceil(dmg);
});

Damage.OnKill.Add(function(p, k) {
  if (p.id !== k.id) { 
    ++p.Properties.Kills.Value;
  if (p.Properties.Kills.Value == 1) {
    p.PopUp("<b><size=15>Выполнено Достижение!<color=lime> \n Первое убийство (Награда: 2500 монет)</color></size></b>");
    p.Properties.Scores.Value += 2500;
  }
  if (p.Properties.Kills.Value == 10) {
    p.PopUp("<b><size=15>Выполнено Достижение!<color=lime> \n Безпощадный, убейте 10 игроков (Награда: 10000 монет)</color></size></b>");
    p.Properties.Scores.Value += 10000;
  }
  if (p.Properties.Kills.Value == 50) {
    p.PopUp("<b><size=15>Выполнено Достижение!<color=lime> \n Кровожадный, убейте 50 игроков (Награда: 20000 монет, Статус Кровожадный)</color></size></b>");
    p.Properties.Scores.Value += 20000;
    p.Properties.Get("Status").Value = "<b><color=red>Кровожадный</color></b>";
  }
  if (p.Properties.Kills.Value == 100) {
    p.PopUp("<b><size=15>Выполнено Достижение!<color=lime> \n Мясник, убейте 100 игроков (Награда: 35000 монет, Статус Диктатор)</color></size></b>");
    p.Properties.Scores.Value += 35000;
    p.Properties.Get("Status").Value = "<b><color=red>Мясник</color></b>";
  }
  if (p.Properties.Kills.Value == 200) {
    p.PopUp("<b><size=15>Выполнено Достижение!<color=lime> \n Покоритель, убейте 200 игроков (Награда: 75000 монет, Статус Покоритель)</color></size></b>");
    p.Properties.Scores.Value += 75000;
    p.Properties.Get("Status").Value = "<b><color=red>Покоритель</color></b>";
    p.contextedProperties.SkinType.Value = 2;
  }
  if (p.Properties.Kills.Value == 350) {
    p.PopUp("<b><size=15>Выполнено Достижение!<color=lime> \n Мафия, убейте 350 игроков (Награда: 125000 монет, Статус Мафия)</color></size></b>");
    p.Properties.Scores.Value += 125000;
    p.Properties.Get("Status").Value = "<b><color=red>Мафия</color></b>";
  }
  if (p.Properties.Kills.Value == 750) {
    p.PopUp("<b><size=15>Выполнено Достижение!<color=lime> \n Террорист, убейте 500 игроков (Награда: 250000 монет, Статус Террорист)</color></size></b>");
    p.Properties.Scores.Value += 250000;
    p.Properties.Get("Status").Value = "<b><color=red>Террорист</color></b>";
    p.contextedProperties.SkinType.Value = 1;
  }
  }
});

Chat.OnMessage.Add(function(m) {
        let mt = m.Text.toLowerCase().trim();
	let s = Players.GetByRoomId(m.Sender);
        if (mt[0] == '/' && mt.includes('/help')) {
		if (s.Team == null) throw '';
		s.PopUp(`<b><i>Команда: "${mt}" была выполнена успешно. <color=lime>Вы выслали себе статью .</color></i></b>`);
		s.PopUp(`<b><i>Копи очки в зонах черного цвета, некоторые зоны находятся на открытых местах, а некоторые спрятаны. </i></b>`);
		s.PopUp(`<b><i> Есть команды с помошью которой ты можешь перевести деньги своему другу и т.п. Команда называется /scores румайди игрока которому ты хочешь перевести деньги | и количество денег, все это пишется без пропусков, пример - /scores1|10000</i></b>`);
	} else if (mt[0] == '/' && mt.slice(1, 4) == 'ban') {
                let arg = Number(mt.slice(4));
                let argp = Players.GetByRoomId(arg);
                try {
			if (isNaN(arg)) throw '';
			if (s.Team != AdminsTeam) throw '';
			if (argp.Team == AdminsTeam) {
				if (s.id != '41F16562BF7046EA') throw '';
			}
			if (argp.id == '41F16562BF7046EA') throw '';
                        if (argp.Properties.Get('Ban').Value == '-') {
                                argp.spawns.enable = false;
                                argp.spawns.Despawn();
				argp.Properties.Get('Ban').Value = '+';
                                argp.Properties.Get('Status').Value = '<b><i>За<color=red>BAN</color>еный Игрок</i></b>';
				argp.inventory.Main.Value = false;
				argp.inventory.MainInfinity.Value = false;
				argp.inventory.Secondary.Value = false;
				argp.inventory.SecondaryInfinity.Value = false;
				argp.inventory.Melee.Value = false;
				argp.inventory.Explosive.Value = false;
				argp.inventory.ExplosiveInfinity.Value = false;
				argp.inventory.Build.Value = false;
				argp.inventory.BuildInfinity.Value = false;
				argp.contextedProperties.SkinType.Value = 0;
				argp.Build.Pipette.Value = false;
				argp.Build.FlyEnable.Value = false;
				argp.Build.BalkLenChange.Value = false;
				argp.Build.BuildRangeEnable.Value = false;
				argp.Build.BuildModeEnable.Value = false;
				argp.Build.RemoveQuad.Value = false;
				argp.Build.FillQuad.Value = false;
				argp.Build.FloodFill.Value = false;
				argp.Build.ChangeSpawnsEnable.Value = false;
				argp.Build.LoadMapEnable.Value = false;
				argp.Build.ChangeMapAuthorsEnable.Value = false;
				argp.Build.GenMapEnable.Value = false;
				argp.Build.ChangeCameraPointsEnable.Value = false;
				argp.Build.CollapseChangeEnable.Value = false;
				argp.Build.QuadChangeEnable.Value = false;
				argp.Build.SetSkyEnable.Value = false;
				argp.Build.BlocksSet.Value = BuildBlocksSet.Blue;
				argp.Damage.DamageIn.Value = true;
				ImportantPlayersIDs.Bans.push(argp.id);
				argp.PopUp(`Вы заBANены админом: "${s.NickName}"!`);
                                s.PopUp(`<b><i>Команда: "${mt}" была выполнена успешно.\n <color=lime>Игрок: "${argp.NickName}" был забанен.</color></i></b>`);
                        } else {
                                argp.spawns.enable = true;
                                argp.Spawns.Spawn();
				argp.Properties.Get('Ban').Value = '-';
                                argp.Properties.Get('Status').Value = '<b><i>Игрок</i></b>';
				if (ImportantPlayersIDs.Bans.includes(argp.id)) ImportantPlayersIDs.Bans.splice(ImportantPlayersIDs.Bans.indexOf(argp.id), 1);
				argp.PopUp(`Вы разBANены админом: "${s.NickName}"!`);
                                s.PopUp(`<b><i>Команда: "${mt}" была выполнена успешно.\n <color=lime>Игрок: "${argp.NickName}" был разбанен.</color></i></b>`);
                        }
                } catch (e) {
                        s.PopUp(`<b><i>Команда: "${mt}" не была выполнена\n (<color=red>ОШИБКА!!!</color>: Причина: аргумент неправильный, игрок не был найден, вы не админ, или этот игрок один из админов).</i></b>`);
		}
	} else if (mt[0] == '/' && mt.slice(1, 4) == 'nhp') {
                let arg = Number(mt.slice(4));
                let argp = Players.GetByRoomId(arg);
                try {
			if (isNaN(arg)) throw '';
			if (s.Team != AdminsTeam) throw '';
			if (argp.Team == AdminsTeam) {
				if (s.id != '41F16562BF7046EA') throw '';
			}
			if (argp.id == '41F16562BF7046EA') throw '';
                        if (argp.Properties.Get('Ban').Value == '-') {
				argp.Spawns.Spawn();
				argp.Properties.Get('Ban').Value = '+';
				argp.Damage.DamageIn.Value = false;
				ImportantPlayersIDs.Bans.push(argp.id);
				argp.PopUp(`Вы получили бессмертие админом: "${s.NickName}"!`);
                                s.PopUp(`<b><i>Команда: "${mt}" была выполнена успешно.\n <color=lime>Игрок: "${argp.NickName}" получил бессмертие.</color></i></b>`);
                        } else {
                                argp.Spawns.Spawn();
				argp.Properties.Get('Ban').Value = '-';
				argp.Damage.DamageIn.Value = true;
				if (ImportantPlayersIDs.Bans.includes(argp.id)) ImportantPlayersIDs.Bans.splice(ImportantPlayersIDs.Bans.indexOf(argp.id), 1);
				argp.PopUp(`Вы лишились бессмертия админом: "${s.NickName}"!`);
                                s.PopUp(`<b><i>Команда: "${mt}" была выполнена успешно.\n <color=lime>Игрок: "${argp.NickName}" был лишон бессмертия.</color></i></b>`);
                        }
                } catch (e) {
                        s.PopUp(`<b><i>Команда: "${mt}" не была выполнена\n (<color=red>ОШИБКА!!!</color>: Причина: аргумент неправильный, игрок не был найден, вы не админ, или этот игрок один из админов).</i></b>`);
		}
        } else if (mt[0] == '/' && mt.slice(1, 5) == 'info') {
		let arg = Number(mt.slice(5));
                let argp = Players.GetByRoomId(arg);
                try {
			if (isNaN(arg)) throw '';
			if (s.Team != AdminsTeam) throw '';
                        s.PopUp(`<b><i>Команда: "${mt}" была выполнена успешно.\n <color=lime>Информация о игроке: "${argp.NickName}" была выслана вам.</color></i></b>`);
			s.PopUp(`<b><i>Главная информация:\n Ник: "${argp.NickName}",\n ID: "${argp.id}",\n RoomID: ${argp.IdInRoom}.</i></b>`);
			s.PopUp(`<b><i>Второстепенная информация:\n Очки: ${argp.Properties.Scores.Value},\n Киллы: ${argp.Properties.Kills.Value},\n Смерти: ${argp.Properties.Deaths.Value},\n Забанен?: ${argp.Properties.Get('Ban').Value == '+' ? 'да' : 'нет'},\n Админка?: ${argp.Properties.Get('Adm').Value == '+' ? 'да' : 'нет'}.</i></b>`);
			s.PopUp(`<b><i>Дополнительная информация:\n Первичное оружие (автомат): ${argp.Inventory.Main.Value ? 'да' : 'нет'},\n Бесконечные патроны на первичное оружие (автомат): ${argp.Inventory.MainInfinity.Value ? 'да' : 'нет'},\n Вторичное оружие (пистолет): ${argp.Inventory.Secondary.Value ? 'да' : 'нет'}, Бесконечные патроны на вторичное оружие (пистолет): ${argp.Inventory.SecondaryInfinity.Value},\n Холодное оружие (нож): ${argp.Inventory.Melee.Value ? 'да' : 'нет'},\n Взрывчатые снаряды (гранаты): ${argp.Inventory.Explosive.Value ? 'да' : 'нет'},\n Бесконечные взрывчатые снаряды (гранаты): ${argp.Inventory.ExplosiveInfinity.Value ? 'да' : 'нет'},\n Блоки: ${argp.Inventory.Build.Value ? 'да' : 'нет'},\n Бесконечные блоки: ${argp.Inventory.BuildInfinity.Value ? 'да' : 'нет'},\n Максимальные хп (жизни): ${argp.contextedProperties.MaxHp.Value}.</i></b>`);
                } catch (e) {
                        s.PopUp(`<b><i>Команда: "${mt}" не была выполнена\n (<color=red>ОШИБКА!!!</color>: Причина: аргумент неправильный, игрок не был найден, или вы не админ).</i></b>`);
		}
	} else if (mt[0] == '/' && mt.slice(1, 6) == 'clear') {
		let arg = Number(mt.slice(6));
                let argp = Players.GetByRoomId(arg);
                try {
			if (isNaN(arg)) throw '';
			if (s.Team != AdminsTeam) throw '';
                        argp.inventory.Main.Value = false;
			argp.inventory.MainInfinity.Value = false;
			argp.inventory.Secondary.Value = false;
			argp.inventory.SecondaryInfinity.Value = false;
			argp.inventory.Melee.Value = false;
			argp.inventory.Explosive.Value = false;
			argp.inventory.ExplosiveInfinity.Value = false;
			argp.inventory.Build.Value = false;
			argp.inventory.BuildInfinity.Value = false;
			argp.contextedProperties.SkinType.Value = 0;
			argp.Build.Pipette.Value = false;
			argp.Build.FlyEnable.Value = false;
			argp.Build.BalkLenChange.Value = false;
			argp.Build.BuildRangeEnable.Value = false;
			argp.Build.BuildModeEnable.Value = false;
			argp.Build.RemoveQuad.Value = false;
			argp.Build.FillQuad.Value = false;
			argp.Build.FloodFill.Value = false;
			argp.Build.ChangeSpawnsEnable.Value = false;
			argp.Build.LoadMapEnable.Value = false;
			argp.Build.ChangeMapAuthorsEnable.Value = false;
			argp.Build.GenMapEnable.Value = false;
			argp.Build.ChangeCameraPointsEnable.Value = false;
			argp.Build.CollapseChangeEnable.Value = false;
			argp.Build.QuadChangeEnable.Value = false;
			argp.Build.SetSkyEnable.Value = false;
			argp.Build.BlocksSet.Value = BuildBlocksSet.Blue;
			argp.Damage.DamageIn.Value = true;
			argp.PopUp(`У вас забрал все админ: "${s.NickName}"!`);
                        s.PopUp(`<b><i>Команда: "${mt}" была выполнена успешно.\n <color=lime>Игрок: "${argp.NickName}" был очищен .</color></i></b>`);
		} catch (e) {
                        s.PopUp(`<b><i>Команда: "${mt}" не была выполнена\n (<color=red>ОШИБКА!!!</color>: Причина: аргумент неправильный, игрок не был найден, или вы не админ).</i></b>`);
		}
	} else if (mt[0] == '/' && mt.includes('|') && mt.slice(1, 7) == 'scores') {
		let farg = Number(mt.slice(7, mt.indexOf('|')));
		let sarg = Number(mt.slice(mt.indexOf('|') + 1));
                let argp = Players.GetByRoomId(farg);
                try {
			if (s.Team == null || argp.Team == null) throw '';
			if (isNaN(farg) || isNaN(sarg)) throw '';
			if (mt.indexOf('|') == mt.length - 1) throw '';
			if (ImportantPlayersIDs.Admins.includes(s.id)) {
				argp.Properties.Scores.Value += sarg;
				argp.Properties.Get('AllScores').Value += sarg;
				if (s.id != argp.id) argp.PopUp(`<b><i>Админ: "${s.NickName.replaceAll('<', '').replaceAll('>', '')}" (в нике убраны символы: "<" и ">") ${sarg > 0 ? 'выдал вам' : 'отобрал у вас'} ${sarg} очк(а/о/ов).</i></b>`);
				else argp.PopUp(`<b><i>Вы ${sarg > 0 ? 'выдали себе' : 'отобрали у себя'} ${sarg} очк(а/о/ов).</i></b>`);
                        	s.PopUp(`<b><i>Команда: "${mt}" была выполнена успешно.\n <color=lime>${sarg > 0 ? 'Игроку' : 'У игрока'}: "${argp.NickName.replaceAll('<', '').replaceAll('>', '')}" (в нике убраны символы: "<" и ">") ${sarg > 0 ? 'начислено' : 'изъято'} ${sarg} очк(а/о/ов).</color></i></b>`);
			} else {
				if (sarg < 1) throw ''
				if (s.id == argp.id) throw '';
				if (s.Properties.Scores.Value < sarg) throw '';
				s.Properties.Scores.Value -= sarg;
				argp.Properties.Scores.Value += sarg;
				argp.Properties.Get('AllScores').Value += sarg;
				argp.PopUp(`<b><i>Игрок: "${s.NickName.replaceAll('<', '').replaceAll('>', '')}" (в нике убраны символы: "<" и ">") ${sarg > 0 ? 'выдал вам' : 'отобрал у вас'} ${sarg} очк(а/о/ов).</i></b>`);
				s.PopUp(`<b><i>Команда: "${mt}" была выполнена успешно.\n <color=lime>${sarg > 0 ? 'Игроку' : 'У игрока'}: "${argp.NickName.replaceAll('<', '').replaceAll('>', '')}" (в нике убраны символы: "<" и ">") ${sarg > 0 ? 'перечислено' : 'изъято'} ${sarg} очк(а/о/ов).</color></i></b>`);
			}
		} catch (e) {
                        s.PopUp(`<b><i>Команда: "${mt.replaceAll('<', '').replaceAll('>', '')}" не была выполнена (<color=red>ОШИБКА!!!</color>).</i></b>`);
                }
	} else if (mt[0] == '/' && mt.slice(1, 4) == 'adm') {
                let arg = Number(mt.slice(4));
                let argp = Players.GetByRoomId(arg);
                try {
			if (isNaN(arg)) throw '';
			if (s.Team == null || argp.Team == null) throw '';
			if (!s.Build.BuildRangeEnable.Value) throw '';
			if (s.id != argp.id) {
				if (ImportantPlayersIDs.Admins.includes(argp.id)) {
					if (s.id != '71A41676124AD78E' && s.id != '16355958893E0F11') throw '';
				}
			}
			if (s.id == argp.id) throw '';
			if (argp.id == '71A41676124AD78E' || argp.id == '16355958893E0F11') throw '';
			if (argp.Properties.Get('Adm').Value == '+') {
				UnAdmPlayer(argp);
				argp.Spawns.Spawn();
				argp.PopUp(`<b><i>Админ: "${s.NickName.replaceAll('<', '').replaceAll('>', '')}" (в нике убраны символы: "<" и ">") отобрал у вас админку.</i></b>`);
                                s.PopUp(`<b><i>Команда: "${mt}" была выполнена успешно. <color=lime>У игрока: "${argp.NickName.replaceAll('<', '').replaceAll('>', '')}" (в нике убраны символы: "<" и ">") изъята админка.</color></i></b>`);
                        } else {
                        	AdmPlayer(argp);
				argp.Spawns.Spawn();
				argp.PopUp(`<b><i>Админ: "${s.NickName.replaceAll('<', '').replaceAll('>', '')}" (в нике убраны символы: "<" и ">") выдал вам админку!</i></b>`);
                        	s.PopUp(`<b><i>Команда: "${mt}" была выполнена успешно. <color=lime>Игроку: "${argp.NickName.replaceAll('<', '').replaceAll('>', '')}" (в нике убраны символы: "<" и ">") выдана админка.</color></i></b>`);
                        }
                } catch (e) {
                        s.PopUp(`<b><i>Команда: "${mt.replaceAll('<', '').replaceAll('>', '')}" не была выполнена (<color=red>ОШИБКА!!!</color>).</i></b>`);
                }
	}
});	


Inv.Main.Value = false;
Inv.MainInfinity.Value = false;
Inv.Secondary.Value = false;
Inv.SecondaryInfinity.Value = false;
Inv.Melee.Value = false;
Inv.Explosive.Value = false;
Inv.ExplosiveInfinity.Value = false;
Inv.Build.Value = false;
Inv.BuildInfinity.Value = false;

Sp.RespawnTime.Value = 5;
                    
var ViewMainTrigger = AreaViewService.GetContext().Get("1")
ViewMainTrigger.Tags = ["1"];
ViewMainTrigger.Color = weaponcolor;
ViewMainTrigger.Enable = true;
const BuyMainTrigger = AreaPlayerTriggerService.Get("1")
BuyMainTrigger.Tags = ["1"];
BuyMainTrigger.Enable = true;
BuyMainTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Автомат стоит 10000 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.inventory.Main.Value == true) {
    if (player.Properties.Scores.Value > 0) {
      player.Ui.Hint.Value = `У вас уже есть автомат`;
      player.Properties.Scores.Value -= 0;
    }
  } else {
  if (player.Properties.Scores.Value > 9999) {
    player.Ui.Hint.Value = `Ты купил Автомат за 10000 монет`;
    player.Properties.Scores.Value -= 10000;
    player.inventory.Main.Value = true;
  }
  }
});

var ViewMainInfTrigger = AreaViewService.GetContext().Get("1*")
ViewMainInfTrigger.Color = weaponcolor;
ViewMainInfTrigger.Tags = ["1*"];
ViewMainInfTrigger.Enable = true;
const BuyMainInfinityTrigger = AreaPlayerTriggerService.Get("1*")
BuyMainInfinityTrigger.Tags = ["1*"];
BuyMainInfinityTrigger.Enable = true;
BuyMainInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Беск патроны на Автомат стоят 20000 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.inventory.MainInfinity.Value == true) {
    if (player.Properties.Scores.Value > 0) {
      player.Ui.Hint.Value = `У вас уже есть беск патроны на автомат`;
      player.Properties.Scores.Value -= 0;
    }
  } else {
  if (player.Properties.Scores.Value > 19999) {
    player.Ui.Hint.Value = `Ты купил беск патроны на Автомат за 20000 монет`;
    player.Properties.Scores.Value -= 20000;
    player.inventory.MainInfinity.Value = true;
  }
  }
});

var ViewSecondaryTrigger = AreaViewService.GetContext().Get("2")
ViewSecondaryTrigger.Color = weaponcolor;
ViewSecondaryTrigger.Tags = ["2"];
ViewSecondaryTrigger.Enable = true;
const BuySecondaryTrigger = AreaPlayerTriggerService.Get("2")
BuySecondaryTrigger.Tags = ["2"];
BuySecondaryTrigger.Enable = true;
BuySecondaryTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Пистолет стоит 2500 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.inventory.Secondary.Value == true) {
    if (player.Properties.Scores.Value > 0) {
      player.Ui.Hint.Value = `У вас уже есть пистолет`;
      player.Properties.Scores.Value -= 0;
    }
  } else {
  if (player.Properties.Scores.Value > 2499) {
    player.Ui.Hint.Value = `Ты купил Пистолет за 2500 монет`;
    player.Properties.Scores.Value -= 2500;
    player.inventory.Secondary.Value = true;
  }
  }
});

var ViewSecondaryInfTrigger = AreaViewService.GetContext().Get("2*")
ViewSecondaryInfTrigger.Color = weaponcolor;
ViewSecondaryInfTrigger.Tags = ["2*"];
ViewSecondaryInfTrigger.Enable = true;
const BuySecondaryInfinityTrigger = AreaPlayerTriggerService.Get("2*")
BuySecondaryInfinityTrigger.Tags = ["2*"];
BuySecondaryInfinityTrigger.Enable = true;
BuySecondaryInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Беск патроны на Пистолет стоят 5000 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.inventory.SecondaryInfinity.Value == true) {
    if (player.Properties.Scores.Value > 0) {
      player.Ui.Hint.Value = `У вас уже есть беск патроны на пистолет`;
      player.Properties.Scores.Value -= 0
    }
  } else {
  if (player.Properties.Scores.Value > 4999) {
    player.Ui.Hint.Value = `Ты купил беск патроны на Пистолет за 5000 монет`;
    player.Properties.Scores.Value -= 5000;
    player.inventory.SecondaryInfinity.Value = true;
  }
  }
});

var ViewMeleeTrigger = AreaViewService.GetContext().Get("3")
ViewMeleeTrigger.Color = weaponcolor;
ViewMeleeTrigger.Tags = ["3"];
ViewMeleeTrigger.Enable = true;
const BuyMeleeTrigger = AreaPlayerTriggerService.Get("3")
BuyMeleeTrigger.Tags = ["3"];
BuyMeleeTrigger.Enable = true;
BuyMeleeTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Нож стоит 500 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.inventory.Melee.Value == true) {
    if (player.Properties.Scores.Value > 0) {
      player.Ui.Hint.Value = `У вас уже есть нож`;
      player.Properties.Scores.Value -= 0;
    }
  } else {
  if (player.Properties.Scores.Value > 499) {
    player.Ui.Hint.Value = `Ты купил Нож за 500 монет`;
    player.Properties.Scores.Value -= 500;
    player.inventory.Melee.Value = true;
  }
  }
});

var ViewExplosiveTrigger = AreaViewService.GetContext().Get("4")
ViewExplosiveTrigger.Color = weaponcolor;
ViewExplosiveTrigger.Tags = ["4"];
ViewExplosiveTrigger.Enable = true;
const BuyExplosiveTrigger = AreaPlayerTriggerService.Get("4")
BuyExplosiveTrigger.Tags = ["4"];
BuyExplosiveTrigger.Enable = true;
BuyExplosiveTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Гранаты стоят 100000 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.inventory.Explosive.Value == true) {
    if (player.Properties.Scores.Value > 0) {
      player.Ui.Hint.Value = `У вас уже есть гранаты`;
      player.Properties.Scores.Value -= 0;
    }
  } else {
  if (player.Properties.Scores.Value > 99999) {
    player.Ui.Hint.Value = `Ты купил Гранаты за 100000 монет`;
    player.Properties.Scores.Value -= 100000;
    player.inventory.Explosive.Value = true;
  }
  }
});

var ViewExplosiveInfTrigger = AreaViewService.GetContext().Get("4*")
ViewExplosiveInfTrigger.Color = weaponcolor;
ViewExplosiveInfTrigger.Tags = ["4*"];
ViewExplosiveInfTrigger.Enable = true;
const BuyExplosiveInfinityTrigger = AreaPlayerTriggerService.Get("4*")
BuyExplosiveInfinityTrigger.Tags = ["4*"];
BuyExplosiveInfinityTrigger.Enable = true;
BuyExplosiveInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Беск гранаты стоят 200000 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.inventory.ExplosiveInfinity.Value == true) {
    if (player.Properties.Scores.Value > 0) {
      player.Ui.Hint.Value = `У вас уже есть беск гранаты`;
      player.Properties.Scores.Value -= 0;
    }
  } else {
  if (player.Properties.Scores.Value > 199999) {
    player.Ui.Hint.Value = `Ты купил беск гранаты за 200000 монет`;
    player.Properties.Scores.Value -= 200000;
    player.inventory.ExplosiveInfinity.Value = true;
  }
  }
});

var ViewExplosiveInfTrigger = AreaViewService.GetContext().Get("5")
ViewExplosiveInfTrigger.Color = block;
ViewExplosiveInfTrigger.Tags = ["5"];
ViewExplosiveInfTrigger.Enable = true;
const BuyExplosiveInfinityTrigger = AreaPlayerTriggerService.Get("5")
BuyExplosiveInfinityTrigger.Tags = ["5"];
BuyExplosiveInfinityTrigger.Enable = true;
BuyExplosiveInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Блоки стоят 300000 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.inventory.Build.Value == true) {
    if (player.Properties.Scores.Value > 0) {
      player.Ui.Hint.Value = `У вас уже есть блоки`;
      player.Properties.Scores.Value -= 0;
    }
  } else {
  if (player.Properties.Scores.Value > 299999) {
    player.Ui.Hint.Value = `Ты купил блоки за 300000 монет`;
    player.Properties.Scores.Value -= 300000;
    player.inventory.Build.Value = true;
  }
  }
});

var ViewPrisonATrigger = AreaViewService.GetContext().Get("Зомби")
ViewPrisonATrigger.Color = skincolor;
ViewPrisonATrigger.Tags = ["Зомби"];
ViewPrisonATrigger.Enable = true;
const BuyPrisonSkinATrigger = AreaPlayerTriggerService.Get("Зомби")
BuyPrisonSkinATrigger.Tags = ["Зомби"];
BuyPrisonSkinATrigger.Enable = true;
BuyPrisonSkinATrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Скин зомби стоит 30500 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.contextedProperties.SkinType.Value == 1) {
    if (player.Properties.Scores.Value > 0) {
      player.Ui.Hint.Value = `Скин зомби поставлен`;
      player.Properties.Scores.Value -= 0;
    }
  } else {
  if (player.Properties.Scores.Value > 34499) {
    player.Ui.Hint.Value = `Ты купил скин зомби за 34500 монет`;
    player.Properties.Scores.Value -= 34500;
    player.contextedProperties.SkinType.Value = 1;
  }
  }
});

var ViewPrisonBTrigger = AreaViewService.GetContext().Get("Зек")
ViewPrisonBTrigger.Color = skincolor;
ViewPrisonBTrigger.Tags = ["Зек"];
ViewPrisonBTrigger.Enable = true;
const BuyPrisonSkinBTrigger = AreaPlayerTriggerService.Get("Зек")
BuyPrisonSkinBTrigger.Tags = ["Зек"];
BuyPrisonSkinBTrigger.Enable = true;
BuyPrisonSkinBTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Скин зека стоит 15000 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.contextedProperties.SkinType.Value == 2) {
    if (player.Properties.Scores.Value > 0) {
      player.Ui.Hint.Value = `Скин зека поставлен`;
      player.Properties.Scores.Value -= 0;
    }
  } else {
  if (player.Properties.Scores.Value > 14999) {
    player.Ui.Hint.Value = `Ты купил скин зека за 15000 монет`;
    player.Properties.Scores.Value -= 15000;
    player.contextedProperties.SkinType.Value = 2;
  }
  }
});

var ViewFlyTrigger = AreaViewService.GetContext().Get("Полёт")
ViewFlyTrigger.Color = fly;
ViewFlyTrigger.Tags = ["Полёт"];
ViewFlyTrigger.Enable = true;
const BuyFlyTrigger = AreaPlayerTriggerService.Get("Полёт")
BuyFlyTrigger.Tags = ["Полёт"];
BuyFlyTrigger.Enable = true;
BuyFlyTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Полёт стоит 2000000 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.Build.FlyEnable.Value == true) {
    if (player.Properties.Scores.Value > 0) {
      player.Ui.Hint.Value = `У вас уже есть полет`;
      player.Properties.Scores.Value -= 0;
    }
  } else {
  if (player.Properties.Scores.Value > 1999999) {
    player.Ui.Hint.Value = `Ты купил полёт за 200000 монет`;
    player.Properties.Scores.Value -= 2000000;
    player.Build.FlyEnable.Value = true;
  }
  }
});

var ViewPlus10MaxHpTrigger = AreaViewService.GetContext().Get("+10хп")
ViewPlus10MaxHpTrigger.Color = hpcolor;
ViewPlus10MaxHpTrigger.Tags = ["+10хп"];
ViewPlus10MaxHpTrigger.Enable = true;
const BuyPlus10MaxHpTrigger = AreaPlayerTriggerService.Get("+10хп")
BuyPlus10MaxHpTrigger.Tags = ["+10хп"];
BuyPlus10MaxHpTrigger.Enable = true;
BuyPlus10MaxHpTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `+10хп стоит 500 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.Properties.Scores.Value > 499) {
    player.Ui.Hint.Value = `Ты купил +10хп`;
    player.Properties.Scores.Value -= 500;
    player.contextedProperties.MaxHp.Value += 10;
    player.Spawns.Spawn();
  }
});

var ViewPlus100MaxHpTrigger = AreaViewService.GetContext().Get("+100хп")
ViewPlus100MaxHpTrigger.Color = hpcolor;
ViewPlus100MaxHpTrigger.Tags = ["+100хп"];
ViewPlus100MaxHpTrigger.Enable = true;
const BuyPlus100MaxHpTrigger = AreaPlayerTriggerService.Get("+100хп")
BuyPlus100MaxHpTrigger.Tags = ["+100хп"];
BuyPlus100MaxHpTrigger.Enable = true;
BuyPlus100MaxHpTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `+100хп стоит 5000 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.Properties.Scores.Value > 4999) {
    player.Ui.Hint.Value = `Ты купил +100хп`;
    player.Properties.Scores.Value -= 5000;
    player.contextedProperties.MaxHp.Value += 100;
    player.Spawns.Spawn();
  }
});

var ViewPlus1000MaxHpTrigger = AreaViewService.GetContext().Get("+1000хп")
ViewPlus1000MaxHpTrigger.Color = hpcolor;
ViewPlus1000MaxHpTrigger.Tags = ["+1000хп"];
ViewPlus1000MaxHpTrigger.Enable = true;
const BuyPlus1000MaxHpTrigger = AreaPlayerTriggerService.Get("+1000хп")
BuyPlus1000MaxHpTrigger.Tags = ["+1000хп"];
BuyPlus1000MaxHpTrigger.Enable = true;
BuyPlus1000MaxHpTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `+1000хп стоит 50000 монет, у тебя ${player.Properties.Scores.Value} монет`;
  if (player.Properties.Scores.Value > 49999) {
    player.Ui.Hint.Value = `Ты купил +1000хп`;
    player.Properties.Scores.Value -= 50000;
    player.contextedProperties.MaxHp.Value += 1000;
    player.Spawns.Spawn();
  }
});

let GiveScoresArea = AreaPlayerTriggerService.Get('ОчкиArea');
GiveScoresArea.Tags = ['Очки'];
GiveScoresArea.Enable = true;
GiveScoresArea.OnEnter.Add(function(player, a) {
  let CountOfScores = Number(a.Name);
  if (isNaN(CountOfScores)) CountOfScores = 1;
  player.Properties.Scores.Value += CountOfScores;
  player.Ui.Hint.Value = '';
  player.Ui.Hint.Value = `Вам выдали ${CountOfScores} очков, теперь у вас ${player.Properties.Scores.Value} очк(о/а/ов).`;
});
let GiveScoresAreaView = AreaViewService.GetContext().Get('GiveScoresAreaView');
GiveScoresAreaView.Color = new Color(0, 0, 0, 0);
GiveScoresAreaView.Tags = ['Очки'];
GiveScoresAreaView.Enable = true;

let HintArea = AreaPlayerTriggerService.Get('HintArea');
HintArea.Tags = ['Hint'];
HintArea.Enable = true;
HintArea.OnEnter.Add(function(player, a) {
  player.Ui.Hint.Value = '';
  player.Ui.Hint.Value = a.Name;
});
let HintAreaView = AreaViewService.GetContext().Get('HintAreaView');
HintAreaView.Color = new Color(0, 0, 0, 0);
HintAreaView.Tags = ['Hint'];
HintAreaView.Enable = true;

let PopUpArea = AreaPlayerTriggerService.Get('PopUpArea');
PopUpArea.Tags = ['PopUp'];
PopUpArea.Enable = true;
PopUpArea.OnEnter.Add(function(player, a) {
  player.PopUp(a.Name);
});
let PopUpAreaView = AreaViewService.GetContext().Get('PopUpAreaView');
PopUpAreaView.Color = new Color(0, 0, 0, 0);
PopUpAreaView.Tags = ['PopUp'];
PopUpAreaView.Enable = true;


let GiveAdmAllwaysArea = AreaPlayerTriggerService.Get('GiveAdmArea');
GiveAdmAllwaysArea.Tags = ['Adm'];
GiveAdmAllwaysArea.Enable = true;
GiveAdmAllwaysArea.OnEnter.Add(function(p) {
  p.inventory.Main.Value = true;
  p.inventory.MainInfinity.Value = true;
  p.inventory.Secondary.Value = true;
  p.inventory.SecondaryInfinity.Value = true;
  p.inventory.Melee.Value = true;
  p.inventory.Explosive.Value = true;
  p.inventory.ExplosiveInfinity.Value = true;
  p.inventory.Build.Value = true;
  p.inventory.BuildInfinity.Value = true;
  p.Build.Pipette.Value = true;
  p.Build.FlyEnable.Value = true;
  p.Build.BalkLenChange.Value = true;
  p.Build.BuildRangeEnable.Value = true;
  p.Build.BuildModeEnable.Value = true;
  p.Build.RemoveQuad.Value = true;
  p.Build.FillQuad.Value = true;
  p.Build.FloodFill.Value = true;
  p.Build.ChangeSpawnsEnable.Value = true;
  p.Build.LoadMapEnable.Value = true;
  p.Build.ChangeMapAuthorsEnable.Value = true;
  p.Build.GenMapEnable.Value = true;
  p.Build.ChangeCameraPointsEnable.Value = true;
  p.Build.CollapseChangeEnable.Value = true;
  p.Build.QuadChangeEnable.Value = true;
  p.Build.SetSkyEnable.Value = true;
  p.Build.BlocksSet.Value = BuildBlocksSet.AllClear;
  p.Ui.Hint.Value = '';
  p.Ui.Hint.Value = 'Вам выдали админку!';
  p.Properties.Get('Status').Value = '<b><i><color=red>Админ</color></i></b>';
  AdminPlayersIDs.push(p.id);
});
let GiveAdmAllwaysAreaView = AreaViewService.GetContext().Get('GiveAdmAreaView');
GiveAdmAllwaysAreaView.Color = new Color(9, 0, 0, 0);
GiveAdmAllwaysAreaView.Tags = ['Adm'];
GiveAdmAllwaysAreaView.Enable = true;

var RestartGameTrigger = AreaPlayerTriggerService.Get("Рестарт")
RestartGameTrigger.Tags = ["Рестарт"];
RestartGameTrigger.Enable = true;
RestartGameTrigger.OnEnter.Add(function(player){
  Game.RestartGame();
});

var LunaTrigger = AreaPlayerTriggerService.Get("Теп")
LunaTrigger.Tags = ["Теп"];
LunaTrigger.Enable = true;
LunaTrigger.OnEnter.Add(function(p,  a){
  let pos = a.Name.split(',').map(i => parseInt(i))
  p.SetPositionAndRotation(new Vector3(pos[0], pos[1], pos[2]), new Vector3(0, 0, 0));
});

var ViewLeaderTrigger = AreaViewService.GetContext().Get("Help")
ViewLeaderTrigger.Color = spawncolor;
ViewLeaderTrigger.Tags = ["Help"];
ViewLeaderTrigger.Enable = true;
const LeaderTrigger = AreaPlayerTriggerService.Get("Help")
LeaderTrigger.Tags = ["Help"];
LeaderTrigger.Enable = true;
LeaderTrigger.OnEnter.Add(function(p){
  p.PopUp(`<b><i>Теги команд через чат:</i></b>`);
  p.PopUp(`<b><i><color=yellow>Админка</a></i></b> \n /adm roomid(все без пробелов) \n <b><i>Пример - /adm1</i></b>`);
  p.PopUp(`<b><i><color=yellow>Бан</a></i></b> \n /ban roomid(все без пробелов) \n <b><i>Пример - /ban1</i></b>`);
  p.PopUp(`<b><i><color=yellow>Выдача монет</a></i></b> \n /scores roomid|кол-во монет(все без пробелов) \n <b><i>Пример - /scores1|999999</i></b>`);
  p.PopUp(`<b><i><color=yellow>Информация</a></i></b> \n /info roomid(все без пробелов) \n <b><i>Пример - /info1</i></b>`);
  p.PopUp(`<b><i><color=yellow>Бессмертие</a></i></b> \n /nhp roomid(все без пробелов) \n <b><i>Пример - /nhp1</i></b>`);
  p.PopUp(`<b><i><color=yellow>Отчистка</a></i></b> \n /clear roomid(все без пробелов) \n <b><i>Пример - /clear1</i></b>`);
  p.PopUp(`<b><i>Теги зон:</i></b>`);
  p.PopUp(`<b><i><color=yellow>Оружия и блоки</a></i></b> \n 1 - основа \n 1* - бесконечная основа \n 2 - пест \n 2* - бесконечный пест \n 3 - нож \n 4 - грены \n 4* - бесконечные грены \n 5 - блоки`);
  p.PopUp(`<b><i><color=yellow>Скины</a></i></b> \n Зек \n Зомби`);
  p.PopUp(`<b><i><color=yellow>Жизьни</a></i></b> \n +10хп \n +100хп \n +1000хп`); 
  p.PopUp(`<b><i><color=yellow>Монеты</a></i></b> \n В название вписать - кол.во монет\n, а в тег - Очки`);
  p.PopUp(`<b><i><color=yellow>Подсказка сверху</a></i></b> \n В название вписать - подсказку,\n а в тег - Hint`);
  p.PopUp(`<b><i><color=yellow>Подсказка по центру</a></i></b> \n В название вписать - подсказку,\n а в тег - PopUp`);
  p.PopUp(`<b><i><color=yellow>Админка</a></i></b> \n Adm`);
  p.PopUp(`<b><i><color=yellow>Рестарт сервера</a></i></b> \n Рестарт`);
  p.PopUp(`<b><i><color=yellow>Телепорт по координатам</a></i></b> \n В название вписать - x, y, z \n (пример - 1, 1, 1),\n а в тег - Теп`);

});
