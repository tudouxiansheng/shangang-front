StarRtc.Instance = new StarRtc.StarSDK();
var privateURL = "139.129.119.52";
var webrtcIP = "139.129.119.52";										//后端服务地址，必须为ip（目前只有chrome72以上支持设置成域名），webrtc ip，用于设置webrtc udp ip，用于setSrcServerInfo，setVdnServerInfo，setVoipServerInfo接口，不设置时与后端服务地址privateURL一致
var agentId = "";
var ImUserId = "";
var ImGroupName = "";
var ImGroupId = "";
var baseInfoGroupId = "";
var currRoom = null;
var roomInfo = null;
//当前选中房间下标
var selectSuperTalkIndex;
var deleteGroupId = "";



$(function(){
    $.ajax({
        url: "readProperties.json",
        data: {

        },
        type: 'POST',
        dataType: "json",
        async: false,
        success: function (result) {
            var properties = JSON.parse(result.resultMessage);
            StarRtc.Instance.setMsgServerInfo(properties["private.url"], 19903);

            StarRtc.Instance.setChatRoomServerInfo(properties["private.url"], 19906); 			//ip, websocket port //需要手动从浏览器输入 https://ip:29993 信任证书

            StarRtc.Instance.setSrcServerInfo(properties["private.url"], 19934, 19935, properties["web.rtc.ip"]);  			//ip, websocket port, webrtc port, webrtc ip//需要手动从浏览器输入 https://ip:29994 信任证书

            StarRtc.Instance.setVdnServerInfo(properties["private.url"], 19940, 19941, properties["web.rtc.ip"]); 			//ip, websocket port, webrtc port, webrtc ip //需要手动从浏览器输入 https://ip:29995 信任证书

            StarRtc.Instance.setVoipServerInfo(properties["private.url"], 10086, 10087, 10088, properties["web.rtc.ip"]);
        },
        error: function (msg) {
            ajaxError(msg);
        }
    });
})
var callBack = function (data, status) {
    switch (status) {
        //收到登录消息
        case "onLoginMessage":
            break;
        case "onDelGroupFin":
            StarRtc.Instance.delRoom(CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_SUPER_ROOM.toString(), roomInfo, function (status) {
            });
            $.ajax({
                url: "scp/delSdkGroup.json",
                data: {
                    "userGrpId": deleteGroupId
                },
                type: 'POST',
                dataType: "json",
                async: false,
                success: function (result) {

                },
                error: function (msg) {
                    ajaxError(msg);
                }
            });
            break;
        case "onCreateGroupFin":
            ImGroupId = data.groupId.split("_")[1];
            superTalkCreateNew(ImGroupName);
            break;
        case "onAddGroupUserFin":
            break;
        case "onRemoveGroupUserFin":
            if (data.status == "success") {
            }
            break;
    }
};

function newImLogin(userId) {
    ImUserId = userId;
    StarRtc.Instance.version();
    StarRtc.Instance.login(agentId, userId, callBack);
}

function newGroup(groupId,clientName) {
    baseInfoGroupId = groupId;
    var newGroupName = $("#addGroupName").val().trim();
    if (newGroupName == "") {
        alert("群组名称不能为空！");
        return;
    }
    ImGroupName = newGroupName;
    var addUsers = [];
    addUsers.push(clientName);
    StarRtc.Instance.createGroup(addUsers, newGroupName);
}

function addGroupMembers(userGrpId,userId) {
    $.ajax({
        url: "scp/qryImGroupId.json",
        data: {
            "userGrpId": userGrpId
        },
        type: 'POST',
        dataType: "json",
        async: false,
        success: function (result) {
            var userIds = [];
            userIds.push(userId);
            StarRtc.Instance.addGroupUsers(result.resultMessage, userIds);
        },
        error: function (msg) {
            ajaxError(msg);
        }
    });
}

function deleteGroup(groupId)
{
    deleteGroupId = groupId;
    StarRtc.Instance.delGroup(groupId);

}

function deleteUser(userId)
{
    var groupId = groupID;
    StarRtc.Instance.removeGroupUsers(groupId,userId);
}

//超级对讲回调函数
function superTalkCallBack(data, status, oper) {
    //超级对讲房间SDK对象
    var thisRoom = data.obj;
    switch (status) {
        //链接状态
        case "connect success":
            switch (oper) {
                case "open":
                    //创建视频流，会触发onWebrtcMessage中的streamCreated回调
                    thisRoom.createStream();
                    break;
                case "new":
                    //创建新房间，会触发onWebrtcMessage中的createChannel回调
                    thisRoom.createNew();
                    break;
            }
            break;
        case "connect failed":
        case "connect closed":
            break;
        //收到视频相关回调
        case "onWebrtcMessage":

            switch (data.type) {
                //收到创建房间回调
                case "createChannel":
                    if (data.status == "success") {
                        roomInfo = data.userData.roomInfo;
                        $.ajax({
                            url: "scp/addSdkGroup.json",
                            data: {
                                "userGrpId": baseInfoGroupId,
                                "groupId": ImGroupId,
                                "roomId" : data.userData.roomInfo.id
                            },
                            type: 'POST',
                            dataType: "json",
                            async: false,
                            success: function (result) {

                            },
                            error: function (msg) {
                                ajaxError(msg);
                            }
                        });
                    }
                    break;
            }
            break;

    }
}

function superTalkCreateNew(ImGroupName) {
        if (currRoom != null) {
            //离开房间
            currRoom.leaveRoom();
            //断开连接
            currRoom.sigDisconnect();
            currRoom = null;
        }

        //获取超级对讲SDK
        currRoom = StarRtc.Instance.getSuperRoomSDK("new", superTalkCallBack, {
                "roomInfo": {
                    "creator": ImUserId,
                    "id": "",
                    "name": ImGroupName,
                }
            }
        );
        //链接
        currRoom.sigConnect();
}