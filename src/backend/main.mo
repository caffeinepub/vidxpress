import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  // Video definition
  type Video = {
    id : Text;
    title : Text;
    description : Text;
    uploader : Principal;
    fileId : Text;
    timestamp : Time.Time;
  };

  let videos = Map.empty<Text, Video>();

  // Add authentication logic
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // Add a video (authenticated users only)
  public shared ({ caller }) func addVideo(id : Text, title : Text, description : Text, fileId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can add videos");
    };

    let video : Video = {
      id;
      title;
      description;
      uploader = caller;
      fileId;
      timestamp = Time.now();
    };

    videos.add(id, video);
  };

  // Delete a video (must be authenticated and own the video)
  public shared ({ caller }) func deleteVideo(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can delete videos");
    };

    switch (videos.get(id)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) {
        if (video.uploader != caller) {
          Runtime.trap("Unauthorized: Can only delete your own videos");
        };
        videos.remove(id);
      };
    };
  };

  // Public: Get all videos (as Array)
  public query func getAllVideos() : async [Video] {
    videos.values().toArray();
  };

  // Public: Get single video by ID
  public query func getVideoById(id : Text) : async ?Video {
    videos.get(id);
  };
};
