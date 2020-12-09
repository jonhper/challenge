/**
 * Create a list of all paths and their minimum access level
 * @param {Array<Object>} Registry array of routes
 * @returns {Array<Object>} modified registry
 */
const getAllPaths = (registry) => {

  const orderedRegistry = [];
  // Copy registry
  const paths = JSON.parse(JSON.stringify(registry));
  // Read all paths and create new registy ordened
  paths.forEach(path => {
    // No parents, first level
    if (!path.parent) return orderedRegistry.push(path);
    // Get parent index
    const parentIndex = paths.findIndex(el => el.path === path.parent);
    if (!paths[parentIndex].childrenPath) {
      // Create new children path
      return paths[parentIndex].childrenPath = [path];
    }
    // Add new children path
    paths[parentIndex].childrenPath.push(path);
  });

  // Create registry with absolutePath
  registryAllPaths = createAbsolutePath(orderedRegistry);
  return registryAllPaths;
}

/**
 * Check accessibilty for a user
 * @param {Object} User { name: string, level: number }
 * @param {String} Path path to check
 * @param {Array<Object>} ModifiedRegistry getAllPaths() result
 * @returns {Boolean} if the user has acces
 */
const hasAccess = (user, path, paths) => {
  // Get path Index
  const pathIndex = paths.findIndex(el => el.absolutePath === path);
  // Check access
  if(paths[pathIndex].level > user.level ){
    // No level access
  	return false;
  }else if(paths[pathIndex].parent){
  	// Get parent path index
   	const parentPathIndex = paths.findIndex(el => el.path === paths[pathIndex].parent);
  	// Check parents access
  	return hasAccess(user, paths[parentPathIndex].absolutePath, paths);
  }else{
    // Has access
  	return true;
  }
}

/**
 * Get all paths a user has access too
 * @param {Object} User { name: string, level: number }
 * @param {Array<Object>} ModifiedRegistry getAllPaths() result
 * @returns {Array<Object>} filtered array of routes
 */
const getUserPaths = (user, paths) => {
  const pathAccess = [];
  // Read all paths
  paths.forEach((node, index)=> {
    // Check path access
     result =  hasAccess(user, node.absolutePath, paths);
     if(result)pathAccess.push(node);
  })
  return pathAccess
}

module.exports = {
  getAllPaths,
  hasAccess,
  getUserPaths
}

/**
* Create absolute path for all paths
* @param {Array<Object>} paths paths with children paths
* @param {Object} parentPath Parent path to set absolute path
* @param {Array<Object>} result Paths with absolute path
* @returns {Array<Object>}  Paths with absolute paths
*/
const createAbsolutePath = (paths, parentPath = null, result = []) => {
    // Read paths
  	paths.forEach(path => {
      //console.log(path);
      if(parentPath ==null){
      	// No parents, first level
        path.absolutePath = '/';
      }else{
        // Remove extra slash /
        parentAbsolutePath = (parentPath.absolutePath=='/')? "": parentPath.absolutePath;
        // Set absolute path
        path.absolutePath = parentAbsolutePath  + path.path;
      }
      // Copy path object
      newPath = JSON.parse(JSON.stringify(path));
			// Remove children path attribute
      delete newPath.childrenPath;
      // Add new record  with absolute path
      result.push(newPath)

      // Check children paths
      if (path.childrenPath) {
        // Create absolute path for children
        createAbsolutePath(path.childrenPath, path, result);
      }
    })

    return result;
}
